# Generated by Django 3.2.4 on 2024-06-07 02:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('storage', '0007_auto_20240606_1749'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='datastatistic',
            name='waterMark',
        ),
        migrations.AddField(
            model_name='materialsubject',
            name='waterMark',
            field=models.IntegerField(default=0),
        ),
    ]
