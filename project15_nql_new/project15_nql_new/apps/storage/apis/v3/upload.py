from rest_framework import viewsets, mixins, permissions, exceptions
from ...models.data import UploadHistory, DataReviewState, DataMeta
from apps.account.models.users import UserRole, AdminMaterialCategory
from .serializers import UploadHistorySerializer, SlimUploadHistorySerializer
from .permissions import IsUploadOwner


class UploadViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = UploadHistory.objects.all()
    # serializer_class = UploadHistorySerializer
    permission_classes = (permissions.IsAuthenticated, IsUploadOwner)
    # 查找ID时用的正则表达式
    lookup_value_regex = r'\d+'

    def get_serializer_class(self):
        if self.action == 'list':
            return SlimUploadHistorySerializer
        else:
            return UploadHistorySerializer

    def filter_queryset(self, queryset):
        if not self.request.user.has_role(UserRole.DATA_ADMIN):
            # 一般用户只看得到自己的上传历史
            queryset = queryset.filter(user=self.request.user)
        else:
            # 管理员用户加上private表示只看自己的上传记录
            private = self.request.query_params.get('private', False)
            if private:
                queryset = queryset.filter(user=self.request.user)
        # 根据review_state参数进行过滤
        review_state = self.request.query_params.get('review_state', None)
        if review_state is not None:
            try:
                state = DataReviewState(int(review_state))
                queryset = queryset.filter(review_state=state)
            except ValueError:
                raise exceptions.NotAcceptable()
        # 根据用户可以管理的分类进行过滤
        # 但是root用户可以看到全部
        if not self.request.user.has_role(UserRole.ROOT):
            granted_categories = AdminMaterialCategory.objects.filter(user=self.request.user).values('category_id')
            queryset = queryset.filter(category__in=granted_categories)
        category_list = self.request.query_params.getlist('category')
        if len(category_list) != 0:
            queryset = queryset.filter(category__in=category_list)

        # 根据上传者姓名进行筛选
        real_name = self.request.query_params.get('real_name', None)
        if real_name is not None:
            queryset = queryset.filter(user__real_name__istartswith=real_name)

        # 根据课题进行筛选
        subject = self.request.query_params.get('subject', None)
        if subject is not None:
            upload_history_ids = []
            dm_ids = set(DataMeta.OtherInfoHelper.get_data_meta_id_list_filter_by_subject_id(subject))
            for upload_history in queryset:
                if list(set(upload_history.meta_id_list) & dm_ids):
                    upload_history_ids.append(upload_history.id)
            queryset = queryset.filter(id__in=upload_history_ids)

        return queryset
