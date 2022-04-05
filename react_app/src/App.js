import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getCommentsThunk, deleteCommentThunk, createCommentThunk } from './store/comments.js'
import './App.css';

const h1Style = {
  position: 'sticky',
  top: '0',
  backgroundColor: '#f5f5f5',
  padding: '10px',
  margin: '0',
  fontSize: '2em',
  fontWeight: 'bold',
  textAlign: 'center',
  color: 'rgb(255, 0, 179)',
  textShadow: `10px 10px 1px rgb(0, 255, 34),
  -10px -12px 1px rgb(0, 255, 34),
  -20px -22px 1px black, 
  -30px -30px 1px rgb(255, 238, 0, 0.3)`,
}



function App() {
  const dispatch = useDispatch()
  const comments = useSelector(state => state.comments.comments)

  const [commentText, setCommentText] = useState('')

  const handleDelete = (id) => {
    dispatch(deleteCommentThunk(id))
  }

  useEffect(() => {
    dispatch(getCommentsThunk())
  }, [dispatch])


  const submitComment = (e) => {
    e.preventDefault()
    const comment = {
      'user_name': 'Drew_T',
      'body': commentText
    }
    dispatch(createCommentThunk(comment))
  }


  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <form onSubmit={submitComment}>
        <label htmlFor='comment'>Add a comment</label>
        <input type='textarea' onChange={(e) => setCommentText(e.target.value)} value={commentText}></input>
        <button>Add Comment</button>
      </form>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h1 style={h1Style}>COMMENTS</h1>
        <div className="App">

          {Object.keys(comments)?.map(id => {
            let comment = comments[id]
            return (

              <div key={comment.id} className='single-comment'>
                <div>{comment.user_name}</div>
                <div>{comment.id}</div>
                <button
                  className='delete-Button'
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete Me
                </button>
                <div>{comment.body}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
