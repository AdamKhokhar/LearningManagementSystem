from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, EnrollmentViewSet, ChapterViewSet, UserViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'chapters', ChapterViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

