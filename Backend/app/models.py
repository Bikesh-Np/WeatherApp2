from django.db import models
from django.contrib.auth.models import AbstractUser
from project import settings
from django.core.mail import send_mail

User = settings.AUTH_USER_MODEL

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    username = models.CharField(max_length=200, unique=True)
    dob = models.DateField()
    is_verified = models.BooleanField(default=False)
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    phone = models.CharField(max_length=10)
    citizenship = models.ImageField(upload_to='citizenship_images/', null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'username', 'dob', 'phone', 'citizenship']

    def __str__(self):
        return self.email

    def send_verification_email(self):
        subject = 'Your Account Has Been Verified'
        message = f'Hello {self.first_name},\n\nYour account has been verified by the admin. You can now log in and access all features.\n\nBest regards,\nThe ResQLink Team'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [self.email]
        send_mail(subject, message, email_from, recipient_list)

class Category(models.Model):
    category_name = models.CharField(max_length=200)

    def __str__(self):
        return self.category_name

    
class Product(models.Model):
    product_name = models.CharField(max_length=200)
    product_price = models.FloatField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    image = models.FileField(upload_to='images/', null=True, blank=True)
    product_description = models.TextField() 

    def __str__(self):
        return self.product_name

    
class Volunt(models.Model):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    username = models.CharField(max_length=200, unique=True)
    address = models.CharField(max_length=20)
    profile = models.FileField(upload_to='images/', null=True, blank=True)
    dob = models.DateField()
    phone = models.CharField(max_length=10)
    doa = models.DateField()
    skill = models.TextField()
    experience = models.TextField()
    blood_group = models.TextField()
    verified = models.BooleanField(default=False)  # Add this field
    citizenship = models.ImageField(upload_to='citizenship_images/', null=True, blank=True)

    def __str__(self):
        return self.email

class Payment(models.Model):
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    product_name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.amount}"
    
from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    accuracy = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"

class Assignment(models.Model):
    volunteer = models.ForeignKey(Volunt, on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.volunteer} at {self.location} on {self.date}"