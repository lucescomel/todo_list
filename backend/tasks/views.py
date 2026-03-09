from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """Gère le CRUD des tâches pour l'utilisateur authentifié."""
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']

    def get_queryset(self):
        """Récupère les tâches de l'utilisateur connecté."""
        tasks = Task.objects.filter(owner=self.request.user)
        category_filter = self.request.query_params.get('category')
        
        if category_filter:
            tasks = tasks.filter(category=category_filter)
        return tasks

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
