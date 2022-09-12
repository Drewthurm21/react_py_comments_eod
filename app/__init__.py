import os
import requests
from flask import Flask, request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from app.models import db, Comment
from flask_wtf.csrf import generate_csrf
from .config import Configuration
from app.forms.new_comment_form import NewCommentForm

app = Flask(__name__)
app.config.from_object(Configuration)
db.init_app(app)
migrate = Migrate(app, db)

@app.after_request
def inject_csrf_token(response):
    response.set_cookie('csrf_token', 
                        generate_csrf(),
                        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
                        samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
                        httponly=True)
    return response

@app.route('/seed')
def seed_route():
    text = requests.get("https://baconipsum.com/api/?type=meat-and-filler")
    text = text.json()[0]
    for _ in range(10):
        new_comment = Comment(user_name='Drew', body=text)
        db.session.add(new_comment)
        db.session.commit()
    return { 'comments_seeded': True }
    
@app.route('/comments')
def commants_route():
    comments = Comment.query.all()
    return {
        'comments': [ comment.to_dict() for comment in comments ]
    }

@app.route('/delete/<int:id>')
def delete(id):
    print('hi')
    deleted_comment = Comment.query.filter(Comment.id == id).first()
    Comment.query.filter(Comment.id == id).delete()
    db.session.commit()

    return {
        'deleted_comment': deleted_comment.to_dict()
    }

@app.route('/new', methods=['POST'])
def create_comment():
    form = NewCommentForm()
    data = form.data
    form['csrf_token'].data = request.cookies['csrf_token']
    print(f'FORM :{form["csrf_token"]} \n\n\n\n')
    if form.validate_on_submit():   
        comment = Comment(
            user_name=data['user_name'],
            body=data['body']
        )
        db.session.add(comment)
        db.session.commit()
        return comment.to_dict()
    else:
        return {'errors': form.errors }