from django.db import models

from apps.account.models.users import User
from apps.storage.models import Template


class TemplateRecommend(models.Model):
    class Meta:
        ordering = ('-add_time',)

    id = models.AutoField(primary_key=True)
    expert = models.ForeignKey(User, on_delete=models.PROTECT,
                               related_name='expert',
                               verbose_name="推荐专家")
    template = models.ForeignKey(Template, on_delete=models.PROTECT)  # 模板
    add_time = models.DateTimeField(auto_now_add=True)
    score = models.IntegerField(null=True, default=None, blank=True)
    comment = models.TextField(null=True, blank=True)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'expert': self.expert.username,
            'template': self.template.id,
            'score': self.score,
            'comment': self.comment
        }
