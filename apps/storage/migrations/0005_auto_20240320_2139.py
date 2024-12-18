# Generated by Django 3.2.4 on 2024-03-20 13:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('storage', '0004_auto_20240320_2138'),
    ]

    operations = [
        migrations.AddField(
            model_name='datacontentfile',
            name='size',
            field=models.BigIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='datacontentimage',
            name='size',
            field=models.BigIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='temporarydatatemplate',
            name='size',
            field=models.BigIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='temporaryexportedfile',
            name='size',
            field=models.BigIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='temporaryuploadedfile',
            name='size',
            field=models.BigIntegerField(blank=True, null=True),
        ),
    ]
