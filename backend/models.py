from werkzeug.exceptions import default_exceptions
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass
import datetime

db = SQLAlchemy()
migrate = Migrate()

@dataclass
class Repost(db.Model):
    id:int
    type:str
    user_id:str
    post_id:int
    disc:str
    date:str
    
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String, default="repost")
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    disc = db.Column(db.String)
    date = db.Column(db.String, nullable=False, default=datetime.datetime.now())
    
@dataclass
class Like(db.Model):
    id:int
    type:str
    user_id:str
    post_id:int
    date:str

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String, default="like")
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    date = db.Column(db.String, nullable=False, default=datetime.datetime.now())

@dataclass
class Reply(db.Model):
    id:int
    type:str
    user_id:str
    post_id:int 
    disc:str
    date:str

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String, default="reply")
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    disc = db.Column(db.String)
    date = db.Column(db.String, nullable=False, default=datetime.datetime.now())

@dataclass
class Post(db.Model):
    id:int
    pic:str
    user_id: str
    reply:Reply
    repost:Repost
    like:Like
    disc:str
    date:str

    id = db.Column(db.Integer, primary_key=True)
    disc = db.Column(db.String)
    pic = db.Column(db.String)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    reply = db.relationship('Reply',backref='post')
    repost = db.relationship('Repost',backref='post')
    like = db.relationship('Like',backref='post')
    date = db.Column(db.String, nullable=False, default=datetime.datetime.now())

@dataclass
class User(db.Model):
    id:int
    pic:str
    disc:str
    followers:str
    following:str
    name:str
    date_joined:str
    location:str
    post: Post
    reply: Reply     
    repost: Repost     
    like: Like  
    cover:str

    id = db.Column(db.String, primary_key=True)
    pic = db.Column(db.String)
    disc = db.Column(db.String)
    followers = db.Column(db.String)
    following = db.Column(db.String)
    name = db.Column(db.String)
    date_joined = db.Column(db.String)
    location = db.Column(db.String)
    post = db.relationship('Post',backref='user')
    reply = db.relationship('Reply',backref='user')
    repost = db.relationship('Repost',backref='user')
    like = db.relationship('Like',backref='user')
    cover =db.Column(db.String)

    