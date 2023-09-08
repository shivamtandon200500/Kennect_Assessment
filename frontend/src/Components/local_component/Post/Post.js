import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { ImReply } from "react-icons/im";
import { useState } from "react";
import { API_URL } from "../../../constants";
import { useAlert } from "react-alert";
import { useStore } from "../../../store/store";
import { addComment } from "../../../store/reducers/actions";
import useAxios from "../../../utils/useAxios";

const Post = ({ title, content, name, comments, createdAt,id }) => {
  function formatTime(timestamp) {
    const now = new Date();
    const postDate = new Date(timestamp);
    const timeDifference = now - postDate;
    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (minutesAgo < 60) {
      return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
    } else if (daysAgo === 1) {
      return "Yesterday";
    } else if (daysAgo > 1) {
      return `${daysAgo} days ago`;
    } else {
      const hours = postDate.getHours();
      const minutes = postDate.getMinutes();
      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes}`;
    }
  }
  const alert = useAlert();
  const api = useAxios();
  const [loading,setLoading]  = useState(true)
  const [isOpen, setIsOpen] = useState(null);
  const [text, setText] = useState("");
  const [state, dispatch] = useStore();
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const addPostHandler = async(e) =>{
    e.preventDefault();
    if (!text) {
      alert.error("Please enter your comment");
      return;
    }

    const res = await api.post(API_URL + `/post/posts/${id}/comments`,{text},{
      headers: {
        "Content-Type": "application/json",
        // name: "xyz",
      },
      withCredentials: true,
    }).then(async (response) => {
      if(response.data.msg){
        dispatch(addComment(response.data.comment,id))
        alert.success(response.data.msg);
        setText("");
      }
    }).catch((error) => {
      alert.error(error.response.data.error);
    });;
  }

  console.log('state', state)

  return (
    <div className="card mb-3">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">
          {name}{" "}
          <span style={{ fontSize: "12px", fontWeight: 200 }}>
            {formatTime(createdAt)}
          </span>
        </h6>
      </div>
      <div className="card-body" style={{ marginTop: "-10px" }}>
        <form>
          <div
            className="row g-3 align-items-center"
            style={{ borderBottom: "1px solid #cacaca" }}
          >
            <h4>{title}</h4>
            <p>{content}</p>
          </div>
          <div className="row g-3 align-items-center">
            <div className="help_btn d-flex">
              <AiOutlineHeart />
              <BiCommentDetail onClick={toggleOpen} />
            </div>
          </div>
          {isOpen && (
            <>
              <div className="row g-3 align-items-center">
                <div className="col-6 d-flex flex-column px-lg-3 justify-content-between ps-3 pe-0 py-3">
                  {comments.map((comment) => (
                    <div className="py-2 d-flex justify-content-between bg-transparent border-bottom-0">
                      <div className="d-flex flex-column">
                        <h6 className="mb-0 fw-bold ">
                          {comment.userId.name}{" "}
                          <span style={{ fontSize: "12px", fontWeight: 200 }}>
                            {formatTime(comment.createdAt)}
                          </span>
                        </h6>
                        <p>{comment.text} </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="Comment_section"
                  style={{ borderTop: "1px solid #cacaca", paddingTop: "10px" }}
                >
                  <input type="text" placeholder="Add Comment" value={text} onChange={(e)=>setText(e.target.value)}/>
                  <button type="button" onClick={(e)=>addPostHandler(e)}>
                    <ImReply/>
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Post;
