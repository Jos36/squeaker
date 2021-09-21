# Full Stack Web Application (Squeaker)

## Getting Started

### Installing Dependencies

#### Python 3.9.6

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Enviornment

We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organaized. Instructions for setting up a virual enviornment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

#### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by naviging to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

This will install all of the required packages we selected within the `requirements.txt` file.

##### Key Dependencies

- [Flask](http://flask.pocoo.org/) is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use handle the lightweight sqlite database. You'll primarily work in app.py and can reference models.py.

- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross origin requests from our frontend server.

## Database Setup

With Postgres running, create a new database

```bash
createdb squeaker
```

Then restore the database using the backup file provided. From the backend folder in terminal run:

```bash
cat ./squeaker | psql squeaker
```

## Running the server

From within the `backend` directory first ensure you are working using your created virtual environment.

To run the server in CMD , execute:

```bash
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
```

And for Windows PowerShell

```bash
$env:FLASK_APP="app.py"
$env:FLASK_DEBUG="true"
flask run
```

Setting the `FLASK_ENV` variable to `development` will detect file changes and restart the server automatically.

Setting the `FLASK_APP` variable to `app.py` directs flask to use the `app` directory.

## Base URL

```
{
    http://localhost:5000/
}
```

## API Keys /Authentication

this API using and require authentication token from AUTH0

## Endpoints

- GET '/home/<string:user>'
- GET '/info/<string:username>'
- GET '/<string:username>'
- POST '/follow'
- POST '/squeak'
- POST '/reply/<int:post_id>'
- POST '/upload'
- POST '/action/<int:post_id>'
- DELETE '/delete/<string:type>/<int:id>'

##### GET '/home/<string:user>'

- checks if the user already exist in the database if not it creates a record for the user in the database to store his info
- Fetches a dictionary contain a list of posts for a specific user based on his following list
- Request Arguments: None
- Returns: An object that contains a list of posts and replies

```
{
        "list": data,
        "success":True,
}
```
- example for the reply list of data 
![reply](https://github.com/youssefmohamedsabry/squeaker/blob/main/backend/readme/reply%20ex.png)
- example for the reply data
![reply](https://github.com/youssefmohamedsabry/squeaker/blob/main/backend/readme/in%20reply%20ex.png)
- example for the post data
![post](https://github.com/youssefmohamedsabry/squeaker/blob/main/backend/readme/post%20ex.png)
##### GET '/info/<string:username>'

- Fetches a dictionary contains user info, and user's keys are
![user](https://github.com/youssefmohamedsabry/squeaker/blob/main/backend/readme/user%20ex.png)
- example for the json result

```

    {
      "user":user_info,
      "success":True,
  }

```

##### GET '/<string:username>'

- Fetches the profile info (user data)
- Fetches the follow status (if the current loged in user followed the profile or not)
- Fetches user's posts and replies

```bash
{
      "postList": data,
      "user":followed_user_info,
      "followed":followed,
      "success":True,
  }
```

##### POST ‘/follow’

- It checks if the current logged in user followed the other user or not then update the database based on the result
- Request Arguments:
  - an object contain the username

```bash
{
     follow: user,
}
```

- returns

```bash
{
      "success":True,
      }
```

##### POST ‘/squeak’

##### POST ‘/reply/<int:post_id>’

- posting a reply/post based on the given data from the user
- Request Arguments: passing text for the reply/post content

**example of the returned json**

```
{
  "success":True,
  }
```

**example of the given json**

```
    {"searchTerm":"your search"}
```

##### POST ‘/upload’

- upload an image for the profile photo on firebase then saving the photo url on the database.
- the image name based on the current logged in user name

**example of the returned json**

```
  {
  "success":True,
  }
```

##### POST ‘/action/<int:post_id>’

- Toggle the likes on the posts based on the post id given.

**example of the returned json**

```
  {
  "success":True,
  }
```

##### DELETE ‘/delete/<string:type>/<int:id>’

- delete post/reply based on a given id and the type (post or reply) then return the process status

**example of the returned json**

```
  {
  "success":True,
  }
```

## Error types

- 404 "Not found" - happens when calling a resource that doesn't exist
- 400 "Bad Request" - happens when worng or missing inputs are given
- 500 "Internal Server Error" - server end erorr
- 422 "Unprocessable Entity" - happens when worng or missing inputs are given
