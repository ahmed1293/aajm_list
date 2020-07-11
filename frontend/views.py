from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import render


@login_required()
def index(request):
	return render(request, 'frontend/index.html', {'COMMIT_REF': settings.COMMIT_REF})


class Login(LoginView):
	template_name = 'frontend/login.html'
	extra_context = {'COMMIT_REF': settings.COMMIT_REF}
	redirect_authenticated_user = True


class Logout(LogoutView):
	pass
