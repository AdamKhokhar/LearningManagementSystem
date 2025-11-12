from django.contrib import admin
from .models import Course, Enrollment, Chapter


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor', 'created_at']
    list_filter = ['created_at', 'instructor']
    search_fields = ['title', 'description']
    fields = ['title', 'description', 'instructor']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'enrolled_at', 'is_active']
    list_filter = ['is_active', 'enrolled_at', 'course']
    search_fields = ['student__username', 'course__title']
    fields = ['student', 'course', 'is_active']


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'visibility', 'created_at']
    list_filter = ['visibility', 'created_at', 'course']
    search_fields = ['title', 'course__title']
    fields = ['course', 'title', 'content', 'visibility']
