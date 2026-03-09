from django.db import models
from django.contrib.auth.models import User


class Category(models.TextChoices):
    TRAVAIL = 'travail', 'Travail'
    PERSO = 'perso', 'Perso'
    COURSES = 'courses', 'Courses'
    AUTRE = 'autre', 'Autre'


class Task(models.Model):
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.AUTRE,
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.category}] {self.title} ({'✓' if self.completed else '○'})"
