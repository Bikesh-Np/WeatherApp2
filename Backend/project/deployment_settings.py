import os
from .settings import *  # Import base settings

RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME', 'render-placeholder.com')

DEBUG = False
SECRET_KEY = os.environ.get('SECRET_KEY', SECRET_KEY)

ALLOWED_HOSTS = [RENDER_EXTERNAL_HOSTNAME]
CSRF_TRUSTED_ORIGINS = [f'https://{RENDER_EXTERNAL_HOSTNAME}']

# Static and media file settings for local usage (Render disk)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_ROOT.mkdir(parents=True, exist_ok=True)

# CORS settings for frontend access
CORS_ALLOWED_ORIGINS += [
    "https://resqlinkfront.netlify.app",
    "https://resqlink-frontend.onrender.com",
]
