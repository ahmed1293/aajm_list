from django.contrib.auth.views import LoginView
from django.shortcuts import render


def index(request):
    return render(request, 'frontend/index.html')


class Login(LoginView):

    template_name = 'frontend/login.html'

