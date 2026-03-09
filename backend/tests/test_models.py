import pytest
from tasks.models import Task, Category
from tests.factories import UserFactory, TaskFactory


@pytest.mark.django_db
class TestTaskModel:
    """Tests unitaires sur le modèle Task (logique métier pure, sans HTTP)."""

    def test_create_task_default_status(self):
        """Une nouvelle tâche a le statut 'non terminée' par défaut."""
        task = TaskFactory()
        assert task.completed is False

    def test_create_task_default_category(self):
        """La catégorie par défaut est 'autre' si non précisée."""
        user = UserFactory()
        task = Task.objects.create(title='Test', owner=user)
        assert task.category == Category.AUTRE

    def test_mark_task_as_completed(self):
        """On peut marquer une tâche comme terminée."""
        task = TaskFactory(completed=False)
        task.completed = True
        task.save()
        task.refresh_from_db()
        assert task.completed is True

    def test_task_str_representation(self):
        """La représentation string inclut catégorie et titre."""
        task = TaskFactory(title='Faire les courses', category=Category.PERSO)
        assert 'Faire les courses' in str(task)
        assert 'perso' in str(task)

    def test_task_title_cannot_exceed_255_chars(self):
        """Un titre trop long lève une erreur de validation."""
        from django.core.exceptions import ValidationError
        user = UserFactory()
        task = Task(title='x' * 256, owner=user)
        with pytest.raises(Exception):
            task.full_clean()

    def test_task_ordering_by_created_at_desc(self):
        """Les tâches sont retournées par ordre décroissant de création."""
        user = UserFactory()
        first_task = TaskFactory(owner=user, title='Première')
        second_task = TaskFactory(owner=user, title='Deuxième')
        tasks = list(Task.objects.filter(owner=user))
        assert tasks[0] == second_task
        assert tasks[1] == first_task
