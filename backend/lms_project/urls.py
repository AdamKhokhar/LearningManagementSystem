from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'LMS API',
        'endpoints': {
            'courses': '/api/courses/',
            'chapters': '/api/chapters/',
            'users': '/api/users/',
            'enrollments': '/api/enrollments/',
            'admin': '/admin/'
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('lms_app.urls')),
    path('', api_root),
]
