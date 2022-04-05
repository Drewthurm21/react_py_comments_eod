const GET_COMMENTS = 'comments/LOAD'
const CREATE_COMMENT = 'comment/ADD'
const DELETE_COMMENT = 'comment/DELETE'


const getCommentsAction = (commentsOject) => {
    return {
        type: GET_COMMENTS,
        payload: commentsOject
    }
}

const deleteCommentAction = (deletedComment) => {
    return {
        type: DELETE_COMMENT,
        payload: deletedComment
    }
}

const createCommentAction = (comment) => {
    return {
        type: CREATE_COMMENT,
        payload: comment
    }
}

export const getCommentsThunk = () => async (dispatch) => {
    const response = await fetch('/comments')
    let comment_obj = await response.json()
    let commentArr = comment_obj.comments
    if (response.ok) {
        dispatch(getCommentsAction(commentArr))
    } else {
        //error stuff
    }
}

export const createCommentThunk = (comment) => async (dispatch) => {
    let res = await fetch('/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment)
    })

    if (res.ok) {
        let comment = await res.json()
        dispatch(createCommentAction(comment))
    }
}

export const deleteCommentThunk = (id) => async (dispatch) => {
    const response = await fetch(`/delete/${id}`)
    if (response.ok) {
        dispatch(deleteCommentAction(id))
    } else {
        //error stuff
    }
}


const initialState = {
    comments: []
}
export default function commentsReducer(state = initialState, action) {
    const newState = { ...state }
    switch (action.type) {
        case GET_COMMENTS:
            return {
                comments: action.payload
            }
        case CREATE_COMMENT:
            newState.comments.push(action.payload)
            return newState
        case DELETE_COMMENT:
            let comments = newState.comments.filter(comment => comment.id !== action.payload)
            return {
                comments
            }
        default:
            return state
    }
}