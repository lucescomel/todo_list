from django.contrib.auth.models import User
from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    email = request.data.get('email', '').strip()

    if not username or not password:
        return Response(
            {'error': 'Le nom d\'utilisateur et le mot de passe sont requis.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Ce nom d\'utilisateur est déjà pris.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    User.objects.create_user(username=username, password=password, email=email)
    return Response({'message': 'Compte créé avec succès.'}, status=status.HTTP_201_CREATED)


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
