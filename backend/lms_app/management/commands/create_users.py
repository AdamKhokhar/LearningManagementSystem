from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Creates default users with password "password"'

    def handle(self, *args, **options):
        users = [
            {'username': 'admin', 'email': 'admin@example.com', 'is_staff': True, 'is_superuser': True},
            {'username': 'teacher', 'email': 'teacher@example.com', 'is_staff': False, 'is_superuser': False},
            {'username': 'student1', 'email': 'student1@example.com', 'is_staff': False, 'is_superuser': False},
            {'username': 'student2', 'email': 'student2@example.com', 'is_staff': False, 'is_superuser': False},
        ]
        
        for user_data in users:
            username = user_data['username']
            if User.objects.filter(username=username).exists():
                user = User.objects.get(username=username)
                user.set_password('password')
                user.email = user_data['email']
                user.is_staff = user_data['is_staff']
                user.is_superuser = user_data['is_superuser']
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Updated user: {username}'))
            else:
                user = User.objects.create_user(
                    username=username,
                    email=user_data['email'],
                    password='password',
                    is_staff=user_data['is_staff'],
                    is_superuser=user_data['is_superuser']
                )
                self.stdout.write(self.style.SUCCESS(f'Created user: {username}'))
        
        # Delete old instructor user if it exists
        if User.objects.filter(username='instructor').exists():
            User.objects.filter(username='instructor').delete()
            self.stdout.write(self.style.WARNING('Deleted old instructor user'))
        
        self.stdout.write(self.style.SUCCESS('\nAll users have password: password'))
        self.stdout.write(self.style.SUCCESS('\nDefault users:'))
        self.stdout.write(self.style.SUCCESS('  admin / password (admin account - can access admin panel)'))
        self.stdout.write(self.style.SUCCESS('  teacher / password (frontend only)'))
        self.stdout.write(self.style.SUCCESS('  student1 / password (frontend only)'))
        self.stdout.write(self.style.SUCCESS('  student2 / password (frontend only)'))


