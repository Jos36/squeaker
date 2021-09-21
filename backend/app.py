from flask import abort, request, jsonify
from auth import get_token_auth_header, requires_auth, verify_decode_jwt
from sqlalchemy.orm import aliased
from flask import Flask
from flask_moment import Moment
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy, _record_queries
from models import *
from flask_cors import CORS
from werkzeug.exceptions import ExpectationFailed
import datetime 
import pyrebase
import os

app = Flask(__name__)
moment = Moment(app)
app.config.from_object('config')

db.init_app(app)
migrate.init_app(app,db)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/home/<string:user>', methods=['GET'])
@requires_auth('get:posts')
def index(user):
  # try:
    token = get_token_auth_header()
    payload = verify_decode_jwt(token)
    user_id = payload["sub"].split('|')[1]
    user_info = User.query.filter(User.id==user_id).first()
    if user_info == None:
      new_user = User(id = user_id, name=user, followers='', following='' , date_joined= datetime.datetime.date(datetime.datetime.now()),cover='https://firebasestorage.googleapis.com/v0/b/squeaker-1b7d1.appspot.com/o/images%2Fdef.jpg?alt=media',pic='https://firebasestorage.googleapis.com/v0/b/squeaker-1b7d1.appspot.com/o/images%2Fdef-user.png?alt=media' )
      db.session.add(new_user)
      db.session.commit()
      db.session.close()
    else:
      following = user_info.following.split('-')
      post = db.session.query(Post, User).join(User).filter(Post.user_id.in_(following)).order_by(Post.id)
      user_alias = aliased(User)
      reply = db.session.query(Reply, Post, User,user_alias).join(Reply, Post.reply).join(User).filter(Reply.user_id.in_(following)).filter(user_alias.id != User.id)
      data = []    
      for row in reply:
        data.append([[x for x in row],{"date":row['Reply'].date}])
      for row in post:
        data.append([[x for x in row],{"date":row['Post'].date}])
      data.sort(key=lambda x: datetime.datetime.strptime(x[1]['date'], '%Y-%m-%d %H:%M:%S.%f'),reverse=True )
      
      return (jsonify({
        "list": data,
        "success":True,
    }))
  # except Exception:
  #   db.session.rollback()
  #   abort(500)

@app.route('/follow', methods=["POST"])
@requires_auth('post:edit-profile')
def toggle_follow():
  token = get_token_auth_header()
  payload = verify_decode_jwt(token)
  user_id = payload["sub"].split('|')[1]
  user_info = User.query.filter(User.id==user_id).first()
  print(request.json)
  try:
    followed_user_info = User.query.filter(User.name==request.json['follow']).first()
    print(followed_user_info)
    if followed_user_info is None:
      print('this user is not found 404')
      # Here i should do 'the followed user not found 404 custom handler.
      abort(404)
    else:
      try:
        following = user_info.following.split('-')
        followers = followed_user_info.followers.split('-')
        if followed_user_info.id in user_info.following :
          print('already here')
          following.remove(followed_user_info.id)
          followers.remove(user_info.id)
          print("removed")
          print(following)
          print(followers)

        else:
          print(following)
          print(followers)
          following.append(followed_user_info.id)
          followers.append(user_info.id)
          try:
            followers.remove('')
            following.remove('')
          except:
            pass
          print(following)
          print(followers)
      except Exception:
        pass

      finally:
        following_str = ' '.join([str(char) for char in following]) 
        followers_str = ' '.join([str(char) for char in followers]) 
        print(followers_str)
        print(following_str)
        user_info.following = following_str
        followed_user_info.followers = followers_str
        db.session.commit()
        print("add succsess")
      return (jsonify({ 
      "success":True,
      }))
  except Exception:
    print('somthing went wrong')
    db.session.rollback()
    abort(500)
  finally:
          db.session.close()
      

@app.route('/<string:username>', methods=['GET'])
@requires_auth('get:posts')
def get_profile_posts(username):
  # try:
    token = get_token_auth_header()
    payload = verify_decode_jwt(token)
    user_id = payload["sub"].split('|')[1]
    user_info = User.query.filter(User.id==user_id).first()
    followed_user_info = User.query.filter(User.name==username).first()

    data = []
    post = db.session.query(Post, User).join(User).filter(Post.user_id == followed_user_info.id).order_by(Post.id)
    user_alias = aliased(User)
    reply = db.session.query(Reply, Post, User , user_alias).join(Reply, Post.reply).join(User).filter(Reply.user_id == followed_user_info.id).filter(user_alias.id != User.id)
    for row in reply:
      data.append([[x for x in row],{"date":row['Reply'].date}])
    for row in post:
      data.append([[x for x in row],{"date":row['Post'].date}])
    data.sort(key=lambda x: datetime.datetime.strptime(x[1]['date'], '%Y-%m-%d %H:%M:%S.%f'),reverse=True )
    
    print(followed_user_info)
    if followed_user_info is None:
      print('this user is not found 404')
      # Here i should do 'the followed user not found 404 custom handler.
      abort(404)
    else:
      if followed_user_info.id in user_info.following :
        print('already here')
        followed = True
      else:
        followed = False
    return (jsonify({
      "postList": data,
      "user":followed_user_info,
      "followed":followed,
      "success":True,
  }))
  # except Exception:
  #   abort(500)


@app.route('/squeak', methods=["POST"])
@requires_auth('post:edit-profile')
def squeak():
  token = get_token_auth_header()
  payload = verify_decode_jwt(token)
  user_id = payload["sub"].split('|')[1]
  user_info = User.query.filter(User.id==user_id).first()
  print(request.json)
  new_post = Post(disc=request.json, user_id=user_id)
  db.session.add(new_post)
  db.session.commit()
  db.session.close()
  print("add succsess")
  return (jsonify({
  "success":True,
  }))

@app.route('/reply/<int:post_id>', methods=["POST"])
@requires_auth('post:edit-profile')
def reply(post_id):
  token = get_token_auth_header()
  payload = verify_decode_jwt(token)
  user_id = payload["sub"].split('|')[1]
  user_info = User.query.filter(User.id==user_id).first()
  print(request.json)
  new_reply = Reply(disc=request.json, user_id=user_id, post_id=post_id)
  db.session.add(new_reply)
  db.session.commit()
  db.session.close()
  print("add succsess")
  return (jsonify({
  "success":True,
  }))

@app.route('/upload', methods=["POST"])
@requires_auth('post:edit-profile')
def upload_imb():
  token = get_token_auth_header()
  payload = verify_decode_jwt(token)
  user_id = payload["sub"].split('|')[1]
  user_info = User.query.filter(User.id==user_id).first()
  image = request.files['image']  
  image_ex = os.path.splitext(image.filename)[1]
  config = {    
    "databaseURL": "",
    "apiKey": "",
    "authDomain": "",
    "projectId": "",
    "storageBucket": "",
    "messagingSenderId": "",
    "appId": "",
    "measurementId": ""
    }
  print(image)
  firebase = pyrebase.initialize_app(config)
  storage = firebase.storage()
  img =storage.child(f'images/{user_info.name + image_ex}').put(image)
  img_url=storage.child(f'images/{user_info.name + image_ex}').get_url(img['downloadTokens'])
  print(img_url)
  user_info.pic = img_url
  db.session.commit()
  print("upload succsess")
  return (jsonify({
  "success":True,
  }))

@app.route('/action/<int:post_id>', methods=["POST"])
@requires_auth('get:posts')
def action(post_id):
  token = get_token_auth_header()
  payload = verify_decode_jwt(token)
  user_id = payload["sub"].split('|')[1]
  if request.json["type"] == "like":
    like = Like.query.filter(Like.user_id==user_id,Like.post_id== post_id)
    current_like = like.first()
    print(current_like)
    if current_like is None:
      new_like = Like(user_id=user_id, post_id=post_id)
      db.session.add(new_like)
    else:
      like.delete()
    db.session.commit()
    db.session.close()

  print("like succsess")
  return (jsonify({
  "success":True,
  }))

@app.route('/delete/<string:type>/<int:id>', methods=["DELETE"])
@requires_auth('post:edit-profile')
def delete(type , id):
  token = get_token_auth_header()
  payload = verify_decode_jwt(token)
  user_id = payload["sub"].split('|')[1]
  try:
    if type == "post":
      post = Post.query.filter(Post.id == id)
      current_post = post.first()
      if current_post.user_id == user_id:
        post.delete()
        db.session.commit()
        db.session.close()
      else:
        abort(401)
    

    if type == "reply":
      reply = Reply.query.filter(Reply.id == id)
      current_reply= reply.first()
      if current_reply.user_id == user_id:
          reply.delete()
          db.session.commit()
          db.session.close()
      else:
          abort(401)
    
    print("delete succsess")
  except Exception:
    print("delete failed")
  return (jsonify({
  "success":True,
  }))



@app.route('/info/<string:username>', methods=['GET'])
@requires_auth('get:posts')
def get_user(username):
    token = get_token_auth_header()
    payload = verify_decode_jwt(token)
    user_id = payload["sub"].split('|')[1]
    user_info = User.query.filter(User.id==user_id).first()

    return (jsonify({
      "user":user_info,
      "success":True,
  }))