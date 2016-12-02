from __future__ import unicode_literals

from django.db import models

from django.contrib.auth.models import User


class Expense(models.Model):
	owner = models.ForeignKey(User, on_delete=models.CASCADE)
	date_time = models.DateTimeField(auto_now=False, auto_now_add=False)
	amount = models.DecimalField(max_digits=19, decimal_places=2)
	description = models.TextField()

	def __unicode__(self):
		return self.amount + " spent on " + self.description + " by " +  self.owner
