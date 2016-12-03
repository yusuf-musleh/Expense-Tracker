from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^$', views.index, name='index'),

	# Authentication
	url(r'^signin/', views.signin, name='signin'),
	url(r'^login/', views.login, name='login'),
	url(r'^logout/', views.logout, name='logout'),

	# CRUD Actions
	url(r'^create_new_expense/', views.create_new_expense, name='create_new_expense'),
	url(r'^delete_expense/', views.delete_expense, name='delete_expense'),

]