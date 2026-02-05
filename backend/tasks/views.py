# views.py

from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Task
from .serializers import TaskSerializer
from .permissions import IsOwner


@extend_schema_view(
    get=extend_schema(
        tags=["Tasks"],
        summary="List user tasks",
        description="Returns all tasks owned by the authenticated user",
        responses={200: TaskSerializer(many=True)},
    ),
    post=extend_schema(
        tags=["Tasks"],
        summary="Create a new task",
        description="Creates a task and assigns the authenticated user as owner",
        responses={201: TaskSerializer},
    ),
)
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]

    filterset_fields = {
        "is_done": ["exact"],
        "priority": ["exact"],
    }

    ordering_fields = ["created_at", "due_date", "priority"]
    ordering = ["-created_at"]
    search_fields = ["title", "description"]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@extend_schema_view(
    get=extend_schema(
        tags=["Tasks"],
        summary="Retrieve a task",
        description="Returns a single task owned by the authenticated user",
        responses={200: TaskSerializer},
    ),
    put=extend_schema(
        tags=["Tasks"],
        summary="Replace a task",
        description=(
            "Fully replaces a task owned by the authenticated user. "
            "All required fields must be provided."
        ),
        responses={200: TaskSerializer},
    ),
    patch=extend_schema(
        tags=["Tasks"],
        summary="Partially update a task",
        description="Partially updates fields of a task owned by the authenticated user",
        responses={200: TaskSerializer},
    ),
    delete=extend_schema(
        tags=["Tasks"],
        summary="Delete a task",
        description="Deletes a task owned by the authenticated user",
        responses={204: None},
    ),
)
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        # Owner-only queryset prevents leaking object existence (404 instead of 403)
        return Task.objects.filter(owner=self.request.user)
