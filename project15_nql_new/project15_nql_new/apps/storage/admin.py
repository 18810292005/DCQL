from collections import OrderedDict
from io import StringIO

from django.conf import settings
from django.contrib import admin
from django.core.paginator import Paginator
from django.db import transaction
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.urls import reverse
from django.utils.html import format_html
from django.utils.translation import ugettext as _

from apps.mge.admin_actions import make_published, make_trashed
from apps.search.core_v2.es import Manager
from apps.search.tasks import import_to_es, import_templates_to_es
from mgedata.errors.models import MGEError
from .forms import MaterialCategoryForm
from .models import (MaterialCategory, Template, Snippet, DataMeta, MaterialProject, MaterialSubject, UploadHistory,
                     ResearchDataMeta,
                     MaterialMethodTemplateRelation, MaterialMethod)
from .models.data import DataReviewState
from .models.file import TemporaryUploadedFile


@admin.register(Snippet)
class SnippetAdmin(admin.ModelAdmin):
    list_display = ('id', 'snippet_name', 'user', 'content')


@admin.register(MaterialCategory)
class MaterialCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'level', 'leaf', 'parent', 'doi_prefix', 'order', 'is_public', 'hidden')
    list_filter = ('level', 'leaf', 'doi_prefix', 'order')
    search_fields = ('name_zh', 'name_en', 'doi_prefix')

    form = MaterialCategoryForm


@admin.register(MaterialMethod)
class MaterialMethodAdmin(admin.ModelAdmin):
    list_display = ['id', 'name_zh', 'name_en', 'parent']
    list_editable = ['name_zh', 'name_en', 'parent']
    search_fields = ['name_zh']


def update_es_template(modeladmin, request, queryset):
    templates_id = [query.id for query in queryset]
    import_templates_to_es.delay(templates_id=templates_id)


def delete_object(modeladmin, request, queryset):
    Manager.delete_templates(queryset)
    for o in queryset:
        o.delete()


def clear_object(modeladmin, request, queryset):
    Manager.delete_templates(queryset)
    DataMeta.objects.filter(template__in=queryset).delete()


def delete_all_data_under_template(self, request, queryset):
    template_name_and_data_count = list()
    with transaction.atomic():
        for template in queryset:
            datas = DataMeta.objects.filter(template=template.id)
            meta_data_ids = [meta_data.id for meta_data in datas]
            template_name_and_data_count.append(template.title + '({})'.format(datas.count()))
            datas.delete()
            import_to_es.delay(meta_data_ids)
    self.message_user(request, '模版下的所有数据已被删除（数目）{}'.format(template_name_and_data_count))


update_es_template.short_description = _("Update the data in ES by template(s)")
delete_object.short_description = _("Delete template(s)")
clear_object.short_description = _("Clear template(s)")
delete_all_data_under_template.short_description = _("delete all data under template(s)")


class MaterialMethodTemplateRelationInline(admin.StackedInline):
    model = MaterialMethodTemplateRelation


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    def template_method(self, template):
        return template.method_rel.method.name if template.method_rel is not None else None

    list_display = ('id', 'title', 'category', 'user', 'pub_date', 'published', 'trashed', 'template_method', 'tag')
    list_filter = ('published', 'trashed', 'pub_date', 'category', 'user')
    search_fields = ('id', 'title', 'abstract', 'user__username', 'category__name_zh')
    readonly_fields = ('content', 'user', 'reviewer', 'disapprove_reason')
    autocomplete_fields = ('category',)
    actions = (
        delete_object, clear_object, make_published, make_trashed,
        delete_all_data_under_template, update_es_template)
    inlines = [MaterialMethodTemplateRelationInline, ]

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions


class NoCountPaginator(Paginator):
    @property
    def count(self):
        return 999999999  # Some arbitrarily large number,
        # so we can still get our page tab.


@admin.register(DataMeta)
class DataMetaAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'user', 'add_time', 'template_id', 'downloads', 'views', 'score')
    list_filter = ('add_time',)
    search_fields = (
        'title', 'abstract', 'keywords', 'user__username', 'user__email', 'user__real_name', 'id', 'category__name_zh')
    readonly_fields = (
        'template', 'dc_id', 'category', 'doi', 'user', 'importing', 'dataset')
    actions = ['delete_data', 'batch_update_project', 'update_es_meta']
    show_full_result_count = False
    paginator = NoCountPaginator


    def get_queryset(self, request):
        qs = self.model.raw_objects.get_queryset()
        return qs.select_related('category', 'user')

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions

    def delete_data(self, request, queryset):
        meta_id_list = list()
        for meta in queryset:
            meta_id_list.append(meta.id)
            meta.delete()
        import_to_es(meta_id_list)

    delete_data.short_description = _("Delete data")

    def update_es_meta(self, request, queryset):
        meta_ids = [query.id for query in queryset]
        Manager.insert(meta_ids)

    update_es_meta.short_description = _("Update the data in ES by meta(s)")

    # 批量更新课题信息
    # 数据量过大时不要使用此同步方法，建议从数据库直接改
    def batch_update_project(self, request, queryset):
        if 'cancel' in request.POST:
            self.message_user(request, u'已取消')
            return
        elif 'project_id' in request.POST and 'subject_id' in request.POST:
            project_id = request.POST.get('project_id')
            subject_id = request.POST.get('subject_id')
            try:
                project = MaterialProject.objects.get(id=project_id)
                subject = MaterialSubject.objects.get(id=subject_id)
                if subject.project != project:
                    MGEError.BAD_DATA('课题{}不属于项目{}'.format(subject_id, project_id))

            except (MaterialProject.DoesNotExist, MaterialSubject.DoesNotExist):
                raise MGEError.NOT_FOUND

            queryset.update(other_info={'project': project_id, 'subject': subject_id})
            meta_id_list = [data_meta.id for data_meta in queryset]
            import_to_es.delay(meta_id_list)
            self.message_user(request, "%s successfully updated." % queryset.count())
            return HttpResponseRedirect(request.get_full_path())

        meta_id_list = [data_meta.id for data_meta in queryset]

        return render(request, 'storage/batch_update_project.html',
                      {'objs': queryset, 'meta_id_list': meta_id_list, 'path': request.get_full_path(),
                       'action': 'batch_update_project'})

    batch_update_project.short_description = _("Batch update project data")


@admin.register(MaterialProject)
class MaterialProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'leader_fk', 'institution', 'leader_contact_method')
    autocomplete_fields = ['leader_fk', ]


@admin.register(MaterialSubject)
class MaterialSubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'leader_fk', 'institution', 'leader_contact_method')
    autocomplete_fields = ['leader_fk', ]


@admin.register(UploadHistory)
class UploadHistoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'time', 'user', 'count', 'source', 'review_state', 'reviewer')
    search_fields = ('id', 'time', 'count', 'reviewer__username', 'review_state')
    ordering = ['-time']
    actions = ['batch_update_pending_review_state', 'batch_delete']

    def batch_update_pending_review_state(self, request, queryset):
        with transaction.atomic():
            for upload_history in queryset:
                meta_id_list = upload_history.meta_id_list
                DataMeta.objects.filter(id__in=meta_id_list).update(
                    review_state=DataReviewState.PENDING.value,
                    reviewer=None
                )
            queryset.update(review_state=DataReviewState.PENDING, reviewer=None)
        total = queryset.count()
        self.message_user(request, '{}组上传数据已设置为未审核状态'.format(total))

    def batch_delete(self, request, queryset):
        with transaction.atomic():
            for upload_history in queryset:
                meta_id_list = upload_history.meta_id_list
                for data in DataMeta.objects.filter(id__in=meta_id_list):
                    data.delete()  # use DataMeta.delete() instead of QuerySet.delete()
                import_to_es(meta_id_list)

    batch_update_pending_review_state.short_description = _("批量重置审核状态为未审核")
    batch_delete.short_description = "批量删除数据"


@admin.register(TemporaryUploadedFile)
class TemporaryUploadedFileAdmin(admin.ModelAdmin):
    list_display = ('id', 'size_auto', 'hash_value', 'file')
    search_fields = ('id',)


@admin.register(ResearchDataMeta)
class ResearchDataMetaAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'view', 'title', 'user', 'add_time', 'template_title', 'project_id', 'subject_id')
    search_fields = ('title', 'template__title', 'other_info__project', 'other_info__subject')
    actions = ['stats']
    list_max_show_all = 100

    def stats(self, request, queryset):
        res = OrderedDict()
        files = StringIO()
        obj: DataMeta
        for obj in queryset:
            title = obj.title
            if obj.disapproved:
                continue
            if not obj.approved:
                title += '（等待审核）'

            res.setdefault(title, []).append(
                settings.SITE_ADDR + reverse("storage:show_data", kwargs={"did": obj.id}))
        total = sum(len(x) for x in res.values())
        reduced = len(res)
        files.write(f'{total}条 ')
        if reduced != total:
            files.write(f'(其中{total - reduced}条重复，应为{reduced}条)')
        files.write('\n')
        for k, v in res.items():
            files.write(k + '\n')
            files.write('\n'.join(v))
            files.write('\n\n')
        files.seek(0)
        return HttpResponse(files, content_type='text/plain;charset=utf-8')

    def get_queryset(self, request):
        return DataMeta.objects.filter(category_id=101).select_related('template')

    def template_title(self, obj):
        return obj.template.title

    def project_id(self, obj):
        return obj.other_info['project']

    def subject_id(self, obj):
        return obj.other_info['subject']

    def view(self, obj):
        return format_html(f'<a href="{reverse("storage:show_data", kwargs={"did": obj.id})}">查看</a>')
