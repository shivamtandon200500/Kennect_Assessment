export const setUser = (user) => {
    return {
      type: "SET_USER",
      payload: { user },
    };
  };
  
  export const setAuth = (accessToken, auth) => {
    return {
      type: "SET_AUTH",
      payload: { accessToken, auth },
    };
  };
  
  export const setPost = (posts) => {
    return {
      type: "SET_POSTS",
      payload: { posts },
    };
  };

  export const addPost = (post) => {
    return {
      type: "ADD_POST",
      payload: { post },
    };
  };

  export const addComment = (comment,id) => {
    return {
      type: "ADD_COMMENT",
      payload: { comment,id },
    };
  };

  export const logout = () => {
    localStorage.clear();
    return {
      type: "LOGOUT",
    };
  };