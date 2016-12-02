from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout


@login_required(login_url='/signin/')
def index(request):
	context = {}
	context['expenses'] = [{'date_time': '12/1/16', 'amount': '15.00', 'description': 'Pizza for lunch.'}, {'date_time': '11/29/16', 'amount': '5.99', 'description': 'Coffee for coding.'}]
	return render(request, 'tracker/expenses.html', context)


def signin(request):
	if request.user.is_authenticated:
		return HttpResponseRedirect('/')
	else:
		return render(request, 'tracker/signin.html')


def logout(request):
    auth_logout(request)
    return HttpResponseRedirect('/signin/')


def login(request):
	if request.method == 'POST':
		username = request.POST["inputUsername"]
		password = request.POST["inputPassword"]
		user = authenticate(username=username, password=password)
		if user is not None:
			auth_login(request, user)
			# Redirect to a success page.
			return HttpResponseRedirect('/')
		else:
			# Return an 'invalid login' error message.
			context = {'login_error': 'Your username and password didn\'t match. Please try again.'}
			return render(request, 'tracker/signin.html', context)
	else:
		return HttpResponseRedirect('/')

def new_expense(request):
	return HttpResponse('new expense backend call')


