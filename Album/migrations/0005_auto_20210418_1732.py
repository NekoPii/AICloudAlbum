# Generated by Django 3.2 on 2021-04-18 09:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Album', '0004_auto_20210418_1727'),
    ]

    operations = [
        migrations.AlterField(
            model_name='face',
            name='cnt',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='folder',
            name='cnt',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='picture',
            name='height',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='picture',
            name='width',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='usertag',
            name='cnt',
            field=models.IntegerField(default=0),
        ),
    ]
