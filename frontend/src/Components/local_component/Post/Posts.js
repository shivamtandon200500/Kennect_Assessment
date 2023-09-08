import Post from "./Post";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { AiOutlineSearch } from "react-icons/ai";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Posts.css";
import { useEffect, useState } from "react";
import useAxios from "../../../utils/useAxios";
import { API_URL } from "../../../constants";
import { useAlert } from "react-alert";
import { addPost, logout, setPost } from "../../../store/reducers/actions";
import { useStore } from "../../../store/store";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  border: "1px solid #c9c9c9",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "50ch",
    },
  },
}));


const Posts = () => {
  const alert = useAlert();
  const [modalShow, setModalShow] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading,setLoading]  = useState(true)
  const [posts,setPosts] = useState([]);
  const [state, dispatch] = useStore();
  const [search, setSearch] = useState("");
  const api = useAxios();
  
  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const res = await api.get(API_URL + "/post/get-posts");
      if (!res.data.error) {
        setPosts(res.data);
        dispatch(setPost(res.data));
      } else {
        alert.error(res.data.error);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  const addPostHandler = async(e) =>{
    e.preventDefault();
    if (!title || !content) {
      alert.error("Please enter Title and Content");
      return;
    }

    const res = await api.post(API_URL + "/post/addPost",{title,
      content},{
      headers: {
        "Content-Type": "application/json",
        // name: "xyz",
      },
      withCredentials: true,
    }).then(async (response) => {
      if(response.data.msg){
        dispatch(addPost(response.data.post))
        alert.success(response.data.msg);
        setContent("");
        setTitle("");
        setModalShow(false)
      }
    }).catch((error) => {
      alert.error(error.response.data.error);
    });;
  }

  useEffect(() => {
    setTimeout(() => {
      async function fetch() {
        setLoading(true);
        const res = await axios.get(API_URL + `/post/search?q=${search}`);
        if (!res.data.error) {
          setPosts(res.data.posts);
          dispatch(setPost(res.data.posts));
        } else {
          alert.error(res.data.error);
        }
        setLoading(false);
      }
      if(search){
        fetch();
      }else{
        async function fetch() {
          setLoading(true);
          const res = await api.get(API_URL + "/post/get-posts");
          if (!res.data.error) {
            setPosts(res.data);
            dispatch(setPost(res.data));
          } else {
            alert.error(res.data.error);
          }
          setLoading(false);
        }
        fetch();
      }
    },2000);
  }, [search])
  

  const logoutHandler = async () => {
    api.post(API_URL + "/auth/logout", {}, { withCredentials: true, })
      .then(response => {
        dispatch(logout())
        // navigate("/")
      })
      .catch(error => {
        alert.error(error.response.data.error)
      });
  }
  return (
    <div className="row m-0 p-0 w-100 bodyhead">
      {loading?<Box display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh">
      <CircularProgress />
    </Box>:
    <>
      <div className="col-12 d-flex px-lg-3 justify-content-between ps-3 pe-0 py-3">
        <button className="add_post" onClick={() => setModalShow(true)}>
          Add Post
        </button>
        <Search>
          <SearchIconWrapper>
            <AiOutlineSearch />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search Posts…"
            inputProps={{ "aria-label": "search" }}
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
        </Search>
        <button className="add_post yy" style={{color:"red",border:"1px solid red"}} onClick={()=>logoutHandler()}>
          Logout
        </button>
      </div>
      <div className="col-6 d-flex flex-column px-lg-3 justify-content-between ps-3 pe-0 py-3">
        {(state?.posts) && state?.posts?.map((post, index) => (
          <Post title={post.title}
          content={post.content}
          name={post?.userId?.name}
          comments={post.comments}
          createdAt={post.createdAt}
          id={post._id}
          key={index}/>
        ))}

        {(state?.posts.length === 0 && search) && <h3>No result Found</h3>}
        {(state?.posts.length === 0 && !search) && <h3>No Post Yet! Add New Posts</h3>}
      </div>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Add Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* title content */}
          <div className="row">
            <div className="col-6">
            <div className="post_add" style={{display:"flex",flexDirection:"column"}}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            type="text"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e)=>addPostHandler(e)}>Submit</Button>
        </Modal.Footer>
      </Modal></>}
    </div>
  );
};

export default Posts;
