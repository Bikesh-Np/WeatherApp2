from django.shortcuts import render
from rest_framework import generics, status
from django.contrib.auth import get_user_model, authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .serializers import *
from rest_framework.generics import ListAPIView
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.http import JsonResponse
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client  # Add this import at the top of your views.py

# Get the user model
User = get_user_model()

class RegisterUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        role = self.request.data.get('role', 'user')
        user = serializer.save()

        if role == 'admin':
            user.is_superuser = True
            user.is_staff = True
        elif role == 'user':
            user.is_superuser = False
            user.is_staff = True
        user.save()


class LoginUser(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, email=email, password=password)

        if user and not user.is_superuser:
            if not user.is_verified:
                return Response({"error": "User not verified by admin."}, status=status.HTTP_403_FORBIDDEN)

            refreshtoken = RefreshToken.for_user(user)
            return Response({
                "email": user.email,
                "role": "user",
                "refreshtoken": str(refreshtoken),
                "accesstoken": str(refreshtoken.access_token)
            })

        return Response({"error": "Invalid credentials or admin login attempt."}, status=status.HTTP_400_BAD_REQUEST)


class AdminLoginUser(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, email=email, password=password)

        if user and user.is_superuser:
            refreshtoken = RefreshToken.for_user(user)
            return Response({
                "email": user.email,
                "role": "admin",
                "refreshtoken": str(refreshtoken),
                "accesstoken": str(refreshtoken.access_token)
            })

        return Response({"error": "Invalid credentials or user login attempt."}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([IsAdminUser])
def verify_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    is_verified = request.data.get('is_verified', False)

    user.is_verified = is_verified
    user.save()

    if is_verified:
        # Send verification email
        subject = 'Your Account Has Been Verified'
        message = f'Hello {user.first_name},\n\nYour account has been verified by the admin. You can now log in and access all features.\n\nBest regards,\nThe Team'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [user.email]
        send_mail(subject, message, email_from, recipient_list)

    return Response({"message": "User verification status updated successfully."})


# API to Register Volunteers
class VolunteerCreateView(generics.CreateAPIView):
    queryset = Volunt.objects.all()
    serializer_class = VoluntSerializer


from rest_framework import generics, status
from rest_framework.response import Response
from .models import Volunt
from .serializers import VoluntSerializer

# List and Create Volunteers
class VolunteerListView(generics.ListCreateAPIView):
    queryset = Volunt.objects.all()
    serializer_class = VoluntSerializer

# Retrieve, Update, and Delete a Volunteer
class VolunteerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Volunt.objects.all()
    serializer_class = VoluntSerializer

# Verify a Volunteer (Admin Only)
from django.core.mail import send_mail

from twilio.rest import Client
from django.conf import settings

class VerifyVolunteerView(generics.UpdateAPIView):
    queryset = Volunt.objects.all()
    serializer_class = VoluntSerializer

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.verified = True
        instance.save()
        
        # Check if volunteer has phone number
        if not hasattr(instance, 'phone') or not instance.phone:
            print("Volunteer has no phone number assigned - skipping SMS notification")
            return Response({"status": "verified", "sms_sent": False}, status=status.HTTP_200_OK)
        
        try:
            # Initialize Twilio client
            client = Client(
                settings.TWILIO_ACCOUNT_SID,
                settings.TWILIO_AUTH_TOKEN
            )
            
            # Create SMS message
            message_body = f"""Hello {instance.first_name},
            
Your account has been verified by the admin. You can now log in and access all features.

Best regards,
The Team"""
            
            # Send SMS
            message = client.messages.create(
                body=message_body,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=f"+977{instance.phone}"  # Adjust format if needed
            )
            
            print(f"Verification SMS sent with SID: {message.sid}")
            return Response({"status": "verified", "sms_sent": True}, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Failed to send verification SMS: {str(e)}")
            return Response({
                "status": "verified", 
                "sms_sent": False,
                "message": "Account verified but failed to send SMS notification"
            }, status=status.HTTP_200_OK)

# Assign Volunteer to Location

class AssignVolunteerView(generics.CreateAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            # Get volunteer details
            volunteer = Volunt.objects.get(id=request.data['volunteer'])
            location = request.data['location']
            date = request.data['date']
            start_time = request.data['start_time']
            end_time = request.data['end_time']
            
            # Initialize Twilio client
            client = Client(
                settings.TWILIO_ACCOUNT_SID,
                settings.TWILIO_AUTH_TOKEN
            )
            
            # Create SMS message
            message_body = f"""Hello {volunteer.first_name},
            
You have been assigned to a new volunteer position:
            
Location: {location}
Date: {date}
Time: {start_time} - {end_time}
            
Please arrive 15 minutes early for orientation.
            
Thank you for your service!
The ResQLink Volunteer Team"""
            
            try:
                # Send SMS
                message = client.messages.create(
                    body=message_body,
                    from_=settings.TWILIO_PHONE_NUMBER,
                    to=f"+977{volunteer.phone}"  
                )
                print(f"SMS sent with SID: {message.sid}")
            except Exception as e:
                print(f"Failed to send SMS: {str(e)}")
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.db.models import Count, Sum

class DashboardStats(APIView):
    def get(self, request):
        user = request.user
        
        try:
            user_count = User.objects.count()
            volunteer_count = Volunt.objects.count()
            message_count = ContactMessage.objects.count()
            payment_count = Payment.objects.count()
            total_payments = Payment.objects.aggregate(total=Sum('amount'))['total'] or 0
            product_count = Product.objects.count()
            category_count = Category.objects.count()
            # Count unique volunteers with assignments (corrected)
            assignment_count = Assignment.objects.values('volunteer').distinct().count()
            
            # Count total assignments (if you want this instead)
            total_assignments = Assignment.objects.count()

            return Response({
                'user_count': user_count,
                'volunteer_count': volunteer_count,
                'message_count': message_count,
                'payment_count': payment_count,
                'product_count': product_count,
                'category_count': category_count,
                'total_payments': total_payments,
                'assignment_count': assignment_count,
                'total_assignments': total_assignments  # Add this if you want both counts
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)



class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully!"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
def get_payments(request):
    if request.method == 'GET':
        payments = Payment.objects.all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)


from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer

@api_view(['POST'])
def save_product(request):
    if request.method == 'POST':
        try:
            # Extract data from the request
            full_name = request.data.get('full_name')
            phone_number = request.data.get('phone_number')
            amount = request.data.get('amount')
            product_name = request.data.get('product_name')
            quantity = request.data.get('quantity')

            # Save the data to the database
            payment = Payment.objects.create(
                full_name=full_name,
                phone_number=phone_number,
                amount=amount,
                product_name=product_name,
                quantity=quantity,
            )

            return Response({'status': 'success', 'message': 'Payment saved successfully'})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=400)
    else:
        return Response({'status': 'error', 'message': 'Invalid request method'}, status=405)



class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_update(self, serializer):
        # Save the updated fields but exclude `is_verified` from being updated
        user = self.get_object()
        serializer.save(is_verified=user.is_verified)


from django.http import JsonResponse
from .models import ContactMessage

from django.http import JsonResponse
from .models import ContactMessage
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def contact_us(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            message = ContactMessage.objects.create(
                name=data.get('name'),
                email=data.get('email'),
                subject=data.get('subject'),
                message=data.get('message'),
                latitude=data.get('latitude'),
                longitude=data.get('longitude'),
                accuracy=data.get('accuracy')
            )
            return JsonResponse({
                'status': 'success',
                'message': 'Your message has been sent successfully!'
            })
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)
    else:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid request method'
        }, status=405)

def get_contact_messages(request):
    if request.method == 'GET':
        messages = ContactMessage.objects.all().order_by('-created_at')
        messages_list = [
            {
                'id': message.id,
                'name': message.name,
                'email': message.email,
                'subject': message.subject,
                'message': message.message,
                'latitude': str(message.latitude) if message.latitude else None,
                'longitude': str(message.longitude) if message.longitude else None,
                'accuracy': message.accuracy,
                'created_at': message.created_at.strftime('%Y-%m-%d %H:%M:%S')
            }
            for message in messages
        ]
        return JsonResponse({'status': 'success', 'messages': messages_list})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

# Product Views
class AllCategory(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializers

class createCategory(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializers

class updatedeleteCategory(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializers

# Product Views
class AllProduct(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializers

class createProduct(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializers

class updatedeleteProduct(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializers


class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate token and UID
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Send password reset email
        reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"  # Adjust frontend URL
        print(f"Generated Reset Link: {reset_link}")  # Debugging

        subject = "Password Reset Request"
        message = f"Hello {user.first_name},\n\nClick the link below to reset your password:\n{reset_link}\n\nBest Regards,\nResQLink Team"
        send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])

        return Response({"message": "Password reset link sent!"}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        try:
            print(f"Received UIDB64: {uidb64}, Token: {token}")  # Debugging

            # Decode UID
            uid = force_str(urlsafe_base64_decode(uidb64))
            print(f"Decoded UID: {uid}")  # Debugging: Check if UID is properly decoded

            # Fetch user
            user = User.objects.get(pk=uid)
            print(f"User found: {user.email}")  # Debugging
        except (User.DoesNotExist, ValueError, TypeError) as e:
            print(f"Error decoding UID or User Not Found: {str(e)}")
            return Response({"error": "Invalid reset link (User Not Found)"}, status=status.HTTP_400_BAD_REQUEST)

        # Verify token
        if not default_token_generator.check_token(user, token):
            print("Invalid Token: Token verification failed")  # Debugging
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        # Reset Password
        new_password = request.data.get("password")
        if not new_password:
            return Response({"error": "Password field is required"}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 8:
            return Response({"error": "Password must be at least 8 characters long"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password has been reset successfully"}, status=status.HTTP_200_OK)


class AssignmentListAPIView(ListAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer


class AssignmentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer


# In your views.py
import os
from django.http import JsonResponse
from .disaster_services import DisasterService
import json
from datetime import datetime
import requests

def weather_data(request):
    city = request.GET.get('city', None)
    lat = request.GET.get('lat', '27.7172')  # Default: Kathmandu
    lon = request.GET.get('lon', '85.3240')
    
    if city:
        try:
            geocode_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={os.getenv('OPENWEATHER_API_KEY')}"
            geo_response = requests.get(geocode_url)
            geo_response.raise_for_status()
            geo_data = geo_response.json()
            
            if not geo_data:
                return JsonResponse({'error': f"City '{city}' not found"}, status=404)
                
            lat = geo_data[0]['lat']
            lon = geo_data[0]['lon']
        except Exception as e:
            return JsonResponse({'error': f"Geocoding error: {str(e)}"}, status=500)
    
    data = DisasterService.get_weather_data(lat, lon)
    return JsonResponse(data)



def earthquakes(request):
    days = request.GET.get('days', '360')
    min_magnitude = request.GET.get('min_magnitude', '4.5')
    data = DisasterService.get_earthquakes(int(days), float(min_magnitude))
    
    # Transform USGS data to match frontend
    earthquakes = []
    if 'features' in data:
        for feature in data['features']:
            props = feature.get('properties', {})
            geometry = feature.get('geometry', {})
            earthquakes.append({
                'id': feature.get('id', ''),
                'magnitude': props.get('mag', 0),
                'place': props.get('place', 'Unknown location'),
                'time': props.get('time', 0),
                'location': geometry.get('coordinates', [0, 0])[:2]  # [longitude, latitude]
            })
    
    return JsonResponse(earthquakes, safe=False)

def wildfires(request):
    data = DisasterService.get_wildfires()
    
    # Transform EONET data to match frontend
    wildfires = []
    if 'events' in data:
        for event in data['events']:
            # Get first coordinate pair if available
            location = [0, 0]
            if event.get('geometry', []):
                first_geom = event['geometry'][0]
                if 'coordinates' in first_geom:
                    location = first_geom['coordinates'][:2]  # [longitude, latitude]
            
            wildfires.append({
                'id': event.get('id', ''),
                'severity': 'High',  # You might want to calculate this
                'area': event.get('title', 'Wildfire'),
                'time': event.get('geometry', [{}])[0].get('date', ''),
                'location': location
            })
    
    return JsonResponse(wildfires, safe=False)



class VolunteerLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        dob = request.data.get('dob')  # Format: YYYY-MM-DD

        try:
            volunteer = Volunt.objects.get(email=email, dob=dob, verified=True)
            serializer = VoluntSerializer(volunteer)
            return Response({"status": "success", "volunteer": serializer.data}, status=status.HTTP_200_OK)
        except Volunt.DoesNotExist:
            return Response({"status": "fail", "message": "Invalid credentials or not verified"}, status=status.HTTP_401_UNAUTHORIZED)


# views.py
@api_view(['GET'])
def get_volunteer_by_email(request, email):
    try:
        volunt = Volunt.objects.get(email=email)
        serializer = VoluntSerializer(volunt)
        return Response(serializer.data)
    except Volunteer.DoesNotExist:
        return Response({'error': 'Volunteer not found'}, status=404)
