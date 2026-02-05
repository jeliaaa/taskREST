# users/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from django.core.validators import RegexValidator

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    repassword = serializers.CharField(write_only=True)
    phone = serializers.CharField(
        required=True, 
        validators=[RegexValidator(r'^\+?\d{9,15}$', 'Enter a valid phone number')]
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'phone', 'password', 'repassword']

    def validate(self, data):
        if data['password'] != data['repassword']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('repassword')
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()

        # Save phone in profile or User extension (example: user.profile.phone)
        # If you have a profile model: user.profile.phone = validated_data['phone']

        return user

# serializers.py

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")
