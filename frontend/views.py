from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render


@login_required()
def index(request):
    return render(request, 'frontend/index.html')


class Login(LoginView):
    template_name = 'frontend/login.html'
    redirect_authenticated_user = True


class Logout(LogoutView):
    pass

