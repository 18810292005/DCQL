from django.urls import path
from .upload import *
from .template import TemplateViewSet, SnippetViewSet
from .data import DataManager, DataPublicManager
from .dataset import *
from .doi import doi_api
from .material import MaterialMethodView, TemplateMaterialMethodView, MaterialMethodLeavesView

from rest_framework.routers import SimpleRouter

router = SimpleRouter(trailing_slash=False)
router.register(r'upload', UploadViewSet, basename='upload')
router.register(r'templates', TemplateViewSet, basename='templates')
router.register(r'snippets', SnippetViewSet, basename='snippets')


urlpatterns = [
    path(r'data/<int:meta_id>', DataManager.as_view(), name='manage_one_data_by_data_manager'),
    path(r'data/publicRange', DataPublicManager.as_view(), name='manage_data_public_choice'),
    path(r'data/', DataManager.as_view(), name='manage_data_by_data_manager'),
    path(r'dataset', dataset_api, name='create_dataset'),
    path(r'dataset/<int:id>', dataset_api, name='manage_dataset_one'),
    path(r'dataset/doiRegisterInfo', DatasetDoiReview.as_view()),
    path(r'dataset/ref', DatasetReference.as_view(), name="ref_dataset"),
    path(r'doi', doi_api, name='register_doi'),
    path(r'material/method', MaterialMethodView.as_view(), name='material_method'),
    path(r'material/method/leaves', MaterialMethodLeavesView.as_view(), name='material_method_leaves'),
    path(r'template/method', TemplateMaterialMethodView.as_view(), name='template_material_method'),
]

urlpatterns += router.urls
