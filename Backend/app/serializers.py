from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from . models import *
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings


User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'first_name', 'last_name', 'dob', 'is_verified', 'image', 'phone', 'citizenship']
        extra_kwargs = {'password': {'write_only': True}, 'is_verified': {'read_only': True}}

    def create(self, validated_data):
        image = validated_data.pop('image', None) 
        user = CustomUser.objects.create_user(**validated_data)
        if image:
            user.image = image
        user.is_verified = False
        user.save()
        return user



class VoluntSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volunt
        fields = "__all__"



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
    

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'full_name', 'phone_number', 'amount', 'product_name', 'quantity', 'created_at']
 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'is_verified', 'phone', 'dob', 'image', 'citizenship']



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'first_name', 'last_name', 'dob', 'is_verified', 'image', 'citizenship', 'phone']


class CategorySerializers(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        

class ProductSerializers(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True) 

    class Meta:
        model = Product
        fields = ['id', 'product_name', 'product_price', 'category', 'category_name', 'image', 'product_description']



class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")

        # Generate token and UID
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))  

        print(f"Generated Reset Link: http://localhost:3000/reset-password/{uid}/{token}/")  # Debugging

        # Send password reset emails
        reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"
        subject = "Password Reset Request"
        message = f"Hello {user.first_name},\n\nClick the link below to reset your password:\n{reset_link}\n\nBest Regards,\nResQLink Team"
        send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])

        return value


class AssignmentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='volunteer.username', read_only=True)

    class Meta:
        model = Assignment
        fields = ['id', 'volunteer', 'username', 'location', 'date', 'start_time', 'end_time']