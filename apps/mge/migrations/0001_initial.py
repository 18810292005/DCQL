# Generated by Django 3.2.4 on 2024-03-11 10:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DatabaseBackup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('db_type', models.CharField(choices=[('m', 'mongodb'), ('p', 'postgresql'), ('g', 'migrations'), ('d', 'dump for local dev')], max_length=32)),
                ('back_date', models.DateField(auto_now=True)),
                ('file', models.FileField(upload_to='_fs/%Y/%m/%d/')),
            ],
            options={
                'verbose_name': 'Database Backup File',
                'verbose_name_plural': 'Database Backup Files',
            },
        ),
        migrations.CreateModel(
            name='UpdateHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateField()),
                ('content', models.TextField()),
            ],
            options={
                'ordering': ('-time',),
            },
        ),
    ]