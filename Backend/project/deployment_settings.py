import os
from .settings import *  # Import base settings

# Override for production

DEBUG = False

# Use Render's external hostname as ALLOWED_HOSTS and CSRF_TRUSTED_ORIGINS
render_hostname = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if render_hostname:
    ALLOWED_HOSTS = [render_hostname]
    CSRF_TRUSTED_ORIGINS = [f'https://{render_hostname}']

# CORS origins for deployed frontend URL
CORS_ALLOWED_ORIGINS = [
    'https://weatherapp2-ygrv.onrender.com',
]

# Whitenoise static files storage for production
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

# Database (already handled by dj_database_url in base, but you can reinforce here)
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
    )
}

# Middleware: add whitenoise in the right order
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Secret key from environment variable
SECRET_KEY = os.environ.get('SECRET_KEY')

# Email & Twilio credentials should already come from env via base settings
