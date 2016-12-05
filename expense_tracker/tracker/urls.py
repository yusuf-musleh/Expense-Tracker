from django.conf.urls import url

from . import views

urlpatterns = [
	# Pages
	url(r'^$', views.index, name='index'),
	url(r'^get_expenses/', views.get_expenses, name='get_expenses'),

	# Authentication
	url(r'^signin/', views.signin, name='signin'),
	url(r'^login/', views.login, name='login'),
	url(r'^logout/', views.logout, name='logout'),

	# CRUD Actions
	url(r'^create_new_expense/', views.create_new_expense, name='create_new_expense'),
	url(r'^delete_expense/', views.delete_expense, name='delete_expense'),
	url(r'^update_expense/', views.update_expense, name='update_expense'),

	# Report
	url(r'^get_report/', views.get_report, name='get_report'),

]