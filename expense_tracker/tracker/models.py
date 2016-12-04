from __future__ import unicode_literals

from django.db import models

from django.contrib.auth.models import User


class Expense(models.Model):
	owner = models.ForeignKey(User, on_delete=models.CASCADE)
	date_time = models.DateTimeField(auto_now=False, auto_now_add=False)
	amount = models.DecimalField(max_digits=19, decimal_places=2)
	description = models.TextField()


	def to_json(self):
		date_time_str = self.date_time.strftime("%b. %-d, %Y, %-I:%M %p")
		return dict(id=self.id, owner=[self.owner.first_name, self.owner.last_name], date_time=date_time_str, amount=str(self.amount), description=self.description)


	def __unicode__(self):
		return "$" + str(self.amount) + " spent on " + self.description + " by " +  self.owner.username
