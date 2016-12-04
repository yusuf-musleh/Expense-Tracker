from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout

from tracker.models import Expense

from datetime import datetime

import json

@login_required(login_url='/signin/')
def index(request):
	context = {}
	user_expenses = Expense.objects.filter(owner=request.user)
	context['expenses'] = user_expenses
	# context['expenses'] = [{'date_time': '12/1/16', 'amount': '15.00', 'description': 'Pizza for lunch.'}, {'date_time': '11/29/16', 'amount': '5.99', 'description': 'Coffee for coding.'}]
	return render(request, 'tracker/expenses.html', context)


@login_required(login_url='/signin/')
def get_expenses(request):
	all_users = request.POST['all_users']
	if all_users == 'true' and request.user.is_staff:
		success_data = {}
		everyones_expenses = Expense.objects.all()
		everyones_expenses = map(lambda x: x.to_json(), everyones_expenses)
		success_data['status'] = 'success'
		success_data['expenses'] = everyones_expenses
		return HttpResponse(json.dumps(success_data))
	elif all_users == 'false':
		user_expenses = Expense.objects.filter(owner=request.user)
		user_expenses = map(lambda x: x.to_json(), user_expenses)
		success_data = {}
		success_data['status'] = 'success'
		success_data['expenses'] = user_expenses
		return HttpResponse(json.dumps(success_data))
	else:
		failed_data = {}
		failed_data['status'] = 'failed'
		failed_data['message'] = 'You must be an admin to view everybody\'s expenses!'
		return HttpResponse(json.dumps(failed_data))


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


@login_required(login_url='/signin/')
def create_new_expense(request):
	if request.user.is_authenticated and request.method == 'POST':
		try:
			description = request.POST['expense_description']
			amount = request.POST['expense_amount']
			date_time = request.POST['expense_date_time']

			amount = round(float(amount),2)
			datetime_object = datetime.strptime(date_time, '%Y-%m-%d %H:%M')

			new_expense = Expense(owner=request.user, date_time=datetime_object, amount=amount, description=description)
			new_expense.save()

			# success_data = ['success', new_expense.id, new_expense.date_time.strftime("%b. %-d, %Y, %-I:%M %p")]
			success_data = {'status': 'success', 'new_id': new_expense.id, 'readable_date': new_expense.date_time.strftime("%b. %-d, %Y, %-I:%M %p")}
			return HttpResponse(json.dumps( success_data ))
		except:
			failed_data = {'status': 'failed', 'message': 'Failed to create expense, try again!'}
			return HttpResponse(json.dumps(failed_data))
	else:
		failed_data = {'status': 'failed', 'message': 'Failed to create expense, try again!'}
		return HttpResponse(json.dumps(failed_data))


@login_required(login_url='/signin/')
def delete_expense(request):
	if request.method == 'POST':
		try:
			expense_id = request.POST['expense_id']
			expense = Expense.objects.get(id=expense_id, owner=request.user)
			expense.delete()
			return HttpResponse('success')
		except:
			return HttpResponse('You cannot delete an expense you do not own or does not exist!')

	else:
		return HttpResponse('Failed to delete expense!')


@login_required(login_url='/signin/')
def update_expense(request):
	if request.method == 'POST':
		try:
			expense_id = request.POST['expense_id']
			updated_expense_description = request.POST['updated_expense_description']
			updated_expense_amount = request.POST['updated_expense_amount']
			updated_date_time = request.POST['updated_date_time']

			updated_expense_amount = round(float(updated_expense_amount),2)
			updated_date_time = datetime.strptime(updated_date_time, '%Y-%m-%d %H:%M')

		except:
			failed_data = {'status': 'failed', 'message': 'Failed to fetch updated data!'}

		try:
			current_expense = Expense.objects.get(id=expense_id, owner=request.user)
			current_expense.description = updated_expense_description
			current_expense.amount = updated_expense_amount
			current_expense.date_time = updated_date_time

			current_expense.save()
			success_data = {'status': 'success', 'updated_expense': current_expense.to_json()}
			return HttpResponse(json.dumps(success_data))
		except:
			failed_data = {'status': 'failed', 'message': 'You cannot update an expense you do not own or does not exist!'}

	else:
		failed_data = {'status': 'failed', 'message': 'Failed to update expense!'}
		return HttpResponse(json.dumps(failed_data))







