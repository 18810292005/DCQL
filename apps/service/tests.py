from apps.service.models import DatabaseContribution
from apps.storage.models.material import Category
from mgedata.test import MGETestCase


class TestDatabaseContribution(MGETestCase):
    def update(self, db_contribution: DatabaseContribution, update_dict):
        """
        更新数据库贡献表
        """
        field_list = DatabaseContribution.filed_list()
        update_field_list = []
        for field_name in field_list:
            field_value = update_dict.get(field_name)
            if field_value:
                setattr(db_contribution, field_name, field_value)
                update_field_list.append(field_name)
        db_contribution.save(update_fields=update_field_list)

    def sync_category(self):
        """
         同步类别到数据库贡献表中，仅实现同步增加
         TODO：同步删除
        """
        categories = Category.public_objects.all()
        for category in categories:
            db_contribution = DatabaseContribution.objects.filter(category=category)
            if db_contribution.count() == 0:
                DatabaseContribution.objects.create(category=category).save()

    def test_category_hidden(self):
        self.sync_category()
        self.assertEqual(DatabaseContribution.objects.all().count(), 4)
        self.assertEqual(Category.objects.all().count(), 3)  # material_categories_to_create() 中有一个分类被hidden
        db_contributions = DatabaseContribution.objects.all()
        for index, db_contribution in enumerate(db_contributions):
            material_category = Category.public_objects.filter(id=db_contribution.category_id)
            self.assertEqual(material_category.count(), 1)
            self.assertEqual(db_contribution.to_dict(),
                             {'id': index + 1, 'brief': '', 'detail': '', 'participants': {}, 'undertaker': '',
                              'contact': ''})

    def test_contribution(self):
        self.sync_category()
        db_contribution = DatabaseContribution.objects.filter(category_id=4).first()
        update_dict = {
            'detail': 'test_detail',
            'brief': 'test_brief',
            'participants': [{
                'name': '张三',
                'title': '教授',
                'institution': '北京科技大学材料工程学院'
            }, {
                'name': '李四',
                'title': '教授',
                'institution': '北京科技大学材料工程学院'
            }],
            'undertaker': 'test_undertaker',
            'contact': 'test_contact'
        }
        self.update(db_contribution, update_dict)
        self.assertEqual(db_contribution.to_dict(), {'id': 4, 'brief': 'test_brief', 'detail': 'test_detail',
                                                     'participants': [
                                                         {'name': '张三', 'title': '教授', 'institution': '北京科技大学材料工程学院'},
                                                         {'name': '李四', 'title': '教授', 'institution': '北京科技大学材料工程学院'}],
                                                     'undertaker': 'test_undertaker',
                                                     'contact': 'test_contact'}
                         )
