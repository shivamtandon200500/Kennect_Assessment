import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import validator from "validator";
import ClosedEye from "./images/ClosedEye.png";
import OpenEye from "./images/OpenEye.png";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import axios from "axios";
import { API_URL } from "../../../constants";
import { setAuth, setUser } from "../../../store/reducers/actions";
import { useAlert } from "react-alert";
import { useStore } from "../../../store/store";
import "./Home.css";

const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: "#0a5b99",
  },
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "uppercase",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(1),
    color: "rgba(0, 0, 0, 0.85)",
    "&:hover": {
      color: "#0a5b99",
      opacity: 1,
    },
    "&.Mui-selected": {
      color: "#0a5b99",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  })
);

const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [value, setValue] = useState("one");

  const alert = useAlert();
  const navigate = useNavigate();
  const [state, dispatch] = useStore();
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert.error("Please enter Email/password/name");
      return;
    }

    if(!validator.isEmail(email)){
      alert.error("Please Enter a valid Email Address!!!");
      return;
    }
    const data = {
      email,
      password
    };

    axios
      .post(API_URL + "/auth/login", data, {
        headers: {
          "Content-Type": "application/json",
          // name: "xyz",
        },
        withCredentials: true,
      })
      .then(async (response) => {
        if (
          !response.data.error &&
          response.data.accessToken &&
          response.data.user
        ) {
          alert.success("Logged in Successfully");
          setEmail("");
          setPassword("");
          dispatch(setUser(response.data.user));
          dispatch(setAuth(response.data.accessToken, true));
          if (query.get("redirectURL")) {
            navigate(query.get("redirectURL"));
          } else {
            navigate("/post");
          }
        }
      })
      .catch((error) => {
        alert.error(error.response.data.error);
      });
  };

  const signUpHandler = async (e) => {
    if (!email || !password ||!name) {
      alert.error("Please enter Email/password/name");
      return;
    }
    if(!validator.isEmail(email)){
      alert.error("Please Enter a valid Email Address!!!");
      return;
    }
    e.preventDefault();
    const data = {
      name:name,
      email:email,
      password:password,
    };
    const response = await axios.post(API_URL + "/auth/signup", data, {
      withCredentials: true,
    }, {
      headers: {
        // name:'xyz'
      }});
    if (
      !response.data.error &&
      response.data.msg
    ) {
      alert.success("User Registered Successfully!!!")
    } else {
      alert.error(response.data.error);
    }
  };

  return (
    <div className="signup_container signin_container">
      <div className="signup_image_side">
        <img
          src="https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
          alt=""
        />
      </div>
      <div className="signup_form_side_outer">
        <div className="signup_form_side">
          <Box
            sx={{ width: "100%" }}
            className="LoginTabBox"
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <AntTabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <AntTab value="one" label="Login" />
              <AntTab value="two" label="Signup" />
            </AntTabs>
          </Box>
          {value === "one"?<>
          <div className="signup_form_side_form">
            <form
              action="#"
              onSubmit={(event) => {
                loginHandler(event)
              }}
            >
              <input
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Email"
              />
              <div className="position-relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                {password.length !== 0 && (
                  <button
                    className="signupPagePasswordVisibleButton"
                    type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsPasswordVisible(!isPasswordVisible);
                      }}
                  >
                    {isPasswordVisible ? (
                      <img src={ClosedEye} style={{ width: "100%" }} />
                    ) : (
                      <img src={OpenEye} style={{ width: "100%" }} />
                    )}
                  </button>
                )}
              </div>

              <button type="submit" className="form_register_button">
                Login
              </button>
            </form>
          </div>
          </>:
          <>
          <div className="signup_form_side_form">
            <form
              action="#"
              onSubmit={(event) => {
                signUpHandler(event);
              }}
            >
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <div className="position-relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                {password.length !== 0 && (
                  <button
                    className="signupPagePasswordVisibleButton"
                    type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsPasswordVisible(!isPasswordVisible);
                      }}
                  >
                    {isPasswordVisible ? (
                      <img src={ClosedEye} style={{ width: "100%" }} />
                    ) : (
                      <img src={OpenEye} style={{ width: "100%" }} />
                    )}
                  </button>
                )}
              </div>

              <button type="submit" className="form_register_button">
                Sign Up
              </button>
            </form>
          </div>
          </>}
        </div>
      </div>
    </div>
  );
};

export default Home;
