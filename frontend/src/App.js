import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import { useEffect, useState } from "react";
import { API_URL } from "./constants";
import axios from "axios";
import { useStore } from "./store/store";
import { logout, setAuth, setUser } from "./store/reducers/actions";
import useAxios from "./utils/useAxios";
import Home from "./Components/local_component/Home/Home";
import Posts from "./Components/local_component/Post/Posts";
import OnlyUnauthRoute from "./routes/OnlyUnauthRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const api = useAxios();
  const [state, dispatch] = useStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          },
          {
            headers: {
              // name:'xyz'
            },
          }
        );

        if (!response.data.error && response.data.accessToken) {
          dispatch(setAuth(response.data.accessToken, true));
          const res = await api.get("/auth/user/");
          if (!res.data.error) {
            dispatch(setUser(res.data.user));
          }
        } else {
          console.log(response.data.error);
          dispatch(logout());
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute redirectTo="/" />}>
          <Route path="/post" element={<Posts />} />
        </Route>
        <Route element={<OnlyUnauthRoute redirectTo="/post" />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
