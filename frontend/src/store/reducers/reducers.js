export const initialState = {
    accessToken: null,
    authenticated: false,
    user: null,
    posts:null
}

const addPost = (array, item) => {
    console.log('first', array,item)
    array.unshift(item);
    return array;
}

const addComment = (array, item,id) => {
    let index = array.findIndex((i)=>i._id === id);
    if(index > -1){
        array[index].comments.push(item);
    }
    return array;
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_AUTH":
            console.log("data inside-",action.payload)
            return {
                ...state,
                accessToken: action.payload.accessToken,
                authenticated: action.payload.auth,
            };
        case "SET_USER":
            return {
                ...state,
                user: action.payload.user,
            };
        case "SET_POSTS":
            return {
                ...state,
                posts: action.payload.posts,
            };
        case "ADD_POST":
            return {
                ...state,
                posts: addPost(state.posts, action.payload.post),
            };
        case "ADD_COMMENT":
            return {
                ...state,
                posts: addComment(state.posts, action.payload.comment,action.payload.id)
            };
        case "LOGOUT":
            return {
                initialState
            };
        default:
            return state;
    }
}