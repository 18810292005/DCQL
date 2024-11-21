from django.core.management.base import BaseCommand
from apps.account.models import User
from apps.storage.models.file import FileContentType
from apps.storage.utils.data_import_export import import_data


class Command(BaseCommand):
    """
    导入本地压缩包数据
    """

    def add_arguments(self, parser):
        parser.add_argument('file_path', help='需要导入的文件路径')
        parser.add_argument('email', help='上传用户邮箱')

    def handle(self, *args, **options):
        # 获取上传类型，检查正确性
        try:
            upload_filetype = options['upload_filetype']
            template_id = eval(options['template_id'])
        except Exception as e:
            upload_filetype = "OTHERS"
            template_id = -1
        file_path = options['file_path']
        email = options['email']
        user = User.objects.filter(email=email).first()
        with open(file_path, "rb") as f:
            import_data(f, FileContentType.ARCHIVE, uploaded_by=user,
                        upload_filetype=upload_filetype, template_id=template_id, verify_only=False)
