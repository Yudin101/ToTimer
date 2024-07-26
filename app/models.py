from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
	pass

class Task(models.Model):
	user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='user')
	task = models.TextField(blank=True)
	checked = models.BooleanField(default=False)

	def serialize(self):
		return {
			'id': self.id,
			'user': self.user.id,
			'task': self.task,
			'checked': self.checked
		}