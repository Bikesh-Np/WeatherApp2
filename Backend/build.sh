set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate


# if [[ $CREATE_SUPERUSER ]]
# then
#     python manage.py createsuperuser \
#         --noinput \
#         --username "$DJANGO_SUPERUSER_USERNAME" \
#         --email "$DJANGO_SUPERUSER_EMAIL" \
#         --first_name "$DJANGO_SUPERUSER_FIRSTNAME" \
#         --last_name "$DJANGO_SUPERUSER_LASTNAME" \
#         --dob "$DJANGO_SUPERUSER_DOB" \
#         --phone "$DJANGO_SUPERUSER_PHONE" \
#         --citizenship "$DJANGO_SUPERUSER_CITIZENSHIP"
# fi
