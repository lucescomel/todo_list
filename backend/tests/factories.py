import factory
from django.contrib.auth.models import User
from tasks.models import Task, Category


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f'user_{n}')
    email = factory.LazyAttribute(lambda obj: f'{obj.username}@example.com')
    password = factory.PostGenerationMethodCall('set_password', 'testpass123')


class TaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Task

    title = factory.Sequence(lambda n: f'Tâche {n}')
    completed = False
    category = Category.TRAVAIL
    owner = factory.SubFactory(UserFactory)
