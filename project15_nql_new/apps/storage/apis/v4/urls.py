from django.urls import path

from .data_view import upload_export_excel_to_data_view
from .defect_service import get_templates, get_data_with_images
from .file import *
from .data import *
from .hic import get_hic_files
from .offline import export_offline_validate_files, export_thesaurus
from .sc import sc_bulk_export

urlpatterns = [
    path(r'file/upload', FileUploadV4.as_view(), name='file_upload'),
    path(r'data/content', DataUploadV4.as_view(), name='data_upload'),
    path(r'data/sync', DataSyncCommitView.as_view(), name='data_sync'),

    path(r'defectservice/templates', get_templates, name='get_templates'),
    path(r'defectservice/data', get_data_with_images, name='get_data_images'),

    path(r'sc', sc_bulk_export, name='sc_bulk_export'),

    path(r'hic', get_hic_files, name='get_hic_files'),
    path(r'validate', export_offline_validate_files, name='export_offline_files'),
    path(r'thesaurus', export_thesaurus, name='export_thesaurus'),

    path(r'sjg/import', upload_export_excel_to_data_view, name='upload_export_excel_to_data_view')
]
