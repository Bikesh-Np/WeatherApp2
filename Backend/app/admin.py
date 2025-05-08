from django.contrib import admin
from .models import *
from django.core.mail import send_mail
from django.conf import settings

# Custom Admin Class for CustomUser
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_verified')
    list_editable = ('is_verified',)

    def save_model(self, request, obj, form, change):
        # Check if the user is being updated and if `is_verified` has changed to True
        if change and 'is_verified' in form.changed_data and obj.is_verified:
            obj.send_verification_email()  # Send the verification email
        super().save_model(request, obj, form, change)

# Register all models
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(CustomUser, CustomUserAdmin) 
admin.site.register(Payment)
admin.site.register(Volunt)
admin.site.register(ContactMessage)
