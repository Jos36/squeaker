import os
SECRET_KEY = os.urandom(32)
# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = True

# Connect to the database

class DatabaseURI:
    DATABASE_NAME = "squeaker"
    username = 'youssef'
    password = '1'
    url = 'localhost:5432'
    SQLALCHEMY_DATABASE_URI = "postgresql://{}:{}@{}/{}".format(
        username, password, url, DATABASE_NAME)

SQLALCHEMY_DATABASE_URI =  DatabaseURI.SQLALCHEMY_DATABASE_URI