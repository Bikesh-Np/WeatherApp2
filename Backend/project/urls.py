"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app.views import *
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Admin Panel
    path('admin/', admin.site.urls),

    # API Endpoints for Products and Categories
    path('api/products/', AllProduct.as_view(), name='Productlist'),
    path('api/category/', AllCategory.as_view(), name='Categorylist'),
    path('api/createcategory/', createCategory.as_view(), name='createCategory'),
    path('updatecate/<int:pk>/', updatedeleteCategory.as_view(), name='updateDeletecategory'),
    path('api/createproduct/', createProduct.as_view(), name='createProduct'),
    path('updatepro/<int:pk>/', updatedeleteProduct.as_view(), name='updateDeleteproduct'),
    path('api/save-product/', save_product, name='save_product'),
    path('api/get-payments/', get_payments, name='get_payments'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('verify-user/<int:user_id>/', verify_user, name='verify_user'),
    path('api/volunteer/login/', VolunteerLoginView.as_view(), name='volunteer-login'),



    #Disater Updates
    path('api/disasters/weather/', weather_data, name='weather-alerts'),
    path('api/disasters/earthquakes/', earthquakes, name='earthquakes'),
    path('api/disasters/wildfires/', wildfires, name='wildfires'),
 


    # User Authentication Routes
    path('register/', RegisterUser.as_view(), name='register'),
    path('login/', LoginUser.as_view(), name='login'),
    path('assignments/', AssignVolunteerView.as_view(), name='assign-volunteer'),
    path('api/assignments/', AssignmentListAPIView.as_view(), name='assignment-list'),  # New API endpoint
    path('assignments/<int:pk>/', AssignmentRetrieveUpdateDestroyAPIView.as_view(), name='assignment-detail'),
    path('api/volunteer/<str:email>/', get_volunteer_by_email, name='get_volunteer_by_email'),

    path('vol/', VolunteerCreateView.as_view(), name='vol'),
    path('regvol/', VolunteerListView.as_view(), name='volunteer-list'),
    path('regvol/<int:pk>/', VolunteerDetailView.as_view(), name='volunteer-detail'),
    path('regvol/<int:pk>/verify/', VerifyVolunteerView.as_view(), name='verify-volunteer'),
    path('dashboard/stats/', DashboardStats.as_view(), name='dashboard-stats'),
    path('contact-us/', contact_us, name='contact_us'),
    path('get-contact-messages/', get_contact_messages, name='get_contact_messages'),
    
    path('reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    path('adminregister/', RegisterUser.as_view(), name='register'),  # Duplicate for consistency or different user type
    path('admin-login/', AdminLoginUser.as_view(), name='admin_login'),  # Admin Login Endpoint
    path('verify-user/<int:user_id>/', verify_user, name='verify-user'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('delete_user/<int:user_id>/', delete_user, name='delete_user'),

    # Token Managements
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),



] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
