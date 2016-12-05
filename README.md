# Expense-Tracker
An expense tracking system which can generate reports. You can add your expenses with details such as description, amount, date and time of transaction. You will also be able to update/delete your expenses. You can also generate a report of the total amount you spent per week, as well as filter your expenses given a start and end date.

## Installation and Usage

First make sure you have [Python 2.7](https://www.python.org/download/releases/2.7/), then install [Django 1.10](https://www.djangoproject.com/download/) and clone the project. Then:

```sh
$ cd Expense-Tracker
```

Start the **Django Server**:

```sh
$ python manage.py runserver
```

Open a browser go to the following URL:

```
http://localhost:8000/
```
Sign in using one of the following accounts (These are test accounts used for demo purposes):
* username: bob_admin, password: bob_adminpassword, (Admin User)
* username: john_doe, password: john_doepassword, (Normal User)
* username: will_smith, password: willpassword, (Admin User)
* username: tom_jones, password: tom_jonespassword, (Normal User)

The only difference between admin users and normal users, is that admin users are able to view all saved expenses from all useres.

