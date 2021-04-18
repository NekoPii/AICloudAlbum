# Generated by Django 3.2 on 2021-04-18 09:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Folder',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=200)),
                ('cnt', models.PositiveIntegerField(default=0)),
                ('total_size', models.FloatField(default=0)),
                ('create_time', models.DateTimeField()),
                ('modify_time', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('tag', models.CharField(default='', max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=200)),
                ('pwd', models.CharField(default='', max_length=200)),
                ('now_capacity', models.FloatField(default=0)),
                ('max_capacity', models.FloatField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=200)),
                ('create_time', models.DateTimeField()),
                ('time', models.TimeField()),
                ('description', models.CharField(default='', max_length=1000)),
                ('size', models.FloatField(default=0)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.user')),
            ],
        ),
        migrations.CreateModel(
            name='Picture',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=200)),
                ('type', models.CharField(default='', max_length=200)),
                ('upload_time', models.DateTimeField()),
                ('modify_time', models.DateTimeField()),
                ('description', models.CharField(default='', max_length=1000)),
                ('size', models.FloatField(default=0)),
                ('height', models.PositiveIntegerField(default=0)),
                ('width', models.PositiveIntegerField(default=0)),
                ('is_tag', models.BooleanField(default=False)),
                ('is_face', models.BooleanField(default=False)),
                ('folder_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.folder')),
                ('tag_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.tag')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.user')),
            ],
        ),
        migrations.AddField(
            model_name='folder',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.user'),
        ),
        migrations.CreateModel(
            name='Face',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('face_cover', models.CharField(default='', max_length=200)),
                ('cnt', models.PositiveIntegerField(default=0)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.user')),
            ],
        ),
        migrations.CreateModel(
            name='UserTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cnt', models.PositiveIntegerField(default=0)),
                ('tag_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.tag')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.user')),
            ],
            options={
                'unique_together': {('user_id', 'tag_id')},
            },
        ),
        migrations.CreateModel(
            name='TagCover',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pic_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.picture')),
                ('tag_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.tag')),
            ],
            options={
                'unique_together': {('pic_id', 'tag_id')},
            },
        ),
        migrations.CreateModel(
            name='FolderCover',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('folder_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.folder')),
                ('pic_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.picture')),
            ],
            options={
                'unique_together': {('folder_id', 'pic_id')},
            },
        ),
        migrations.CreateModel(
            name='FacePic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('face_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.face')),
                ('pic_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Album.picture')),
            ],
            options={
                'unique_together': {('pic_id', 'face_id')},
            },
        ),
    ]
