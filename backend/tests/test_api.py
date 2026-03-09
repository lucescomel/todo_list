import pytest
from rest_framework.test import APIClient
from rest_framework import status
from tasks.models import Task
from tests.factories import UserFactory, TaskFactory


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(api_client):
    """Prépare un client authentifié pour les tests."""
    user = UserFactory()
    response = api_client.post('/api/auth/token/', {
        'username': user.username,
        'password': 'testpass123',
    })
    token = response.data['access']
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    api_client.user = user
    return api_client


@pytest.mark.django_db
class TestTaskCreate:
    """Vérifie la création de tâches."""

    def test_authenticated_user_can_create_task(self, authenticated_client):
        response = authenticated_client.post('/api/tasks/', {
            'title': 'Nouvelle tâche',
            'category': 'travail',
        })
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'Nouvelle tâche'
        assert response.data['completed'] is False

    def test_unauthenticated_user_cannot_create_task(self, api_client):
        response = api_client.post('/api/tasks/', {'title': 'Test'})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_task_with_invalid_title_returns_400(self, authenticated_client):
        response = authenticated_client.post('/api/tasks/', {'title': '   '})
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_task_owner_is_set_automatically(self, authenticated_client):
        response = authenticated_client.post('/api/tasks/', {
            'title': 'Ma tâche',
            'category': 'perso',
        })
        assert response.data['owner'] == authenticated_client.user.username


@pytest.mark.django_db
class TestTaskList:
    """Vérifie la lecture des tâches."""

    def test_user_sees_only_own_tasks(self, api_client):
        first_user = UserFactory()
        second_user = UserFactory()
        TaskFactory(owner=first_user, title='Tâche user1')
        TaskFactory(owner=second_user, title='Tâche user2')

        # Authentifier first_user
        response = api_client.post('/api/auth/token/', {
            'username': first_user.username,
            'password': 'testpass123',
        })
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')

        response = api_client.get('/api/tasks/')
        assert response.status_code == status.HTTP_200_OK
        titles = [task['title'] for task in response.data]
        assert 'Tâche user1' in titles
        assert 'Tâche user2' not in titles

    def test_filter_tasks_by_category(self, authenticated_client):
        TaskFactory(owner=authenticated_client.user, category='travail')
        TaskFactory(owner=authenticated_client.user, category='perso')

        response = authenticated_client.get('/api/tasks/?category=travail')
        assert response.status_code == status.HTTP_200_OK
        assert all(task['category'] == 'travail' for task in response.data)


@pytest.mark.django_db
class TestTaskDelete:
    """Vérifie la suppression de tâches."""

    def test_user_can_delete_own_task(self, authenticated_client):
        task = TaskFactory(owner=authenticated_client.user)
        response = authenticated_client.delete(f'/api/tasks/{task.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Task.objects.filter(id=task.id).exists()

    def test_user_cannot_delete_other_user_task(self, authenticated_client, api_client):
        other_user = UserFactory()
        task = TaskFactory(owner=other_user)
        response = authenticated_client.delete(f'/api/tasks/{task.id}/')
        assert response.status_code == status.HTTP_404_NOT_FOUND
