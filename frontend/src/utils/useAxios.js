import axios from "axios";
import jwt_decode from "jwt-decode";
import { API_URL } from "../constants";
import { logout, setAuth } from "../store/reducers/actions";
import { useStore } from "../store/store";


const useAxios = () => {
  const [state, dispatch] = useStore();

  const axiosA = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.accessToken}`,
      // name:'xyz',
    },
    validateStatus: (status) => {
      // don't want axios throwin error on 4xx and 5xx #sorry axios
      return true
    }
  });

  const refreshToken = async () => {
    const response = await axios.post(
      `${API_URL}/auth/refresh-token`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          // name:'xyz'
        },
        withCredentials: true,
      }
    );
    
    console.log('response', response.data.accessToken)

    if (!response.data.error && response.data.accessToken) {
      dispatch(setAuth(response.data.accessToken, true));
      return response.data.accessToken;
    } else {
      console.log("logging out because couldn't refresh");
      dispatch(logout());
      return "";
    }
  };

  axiosA.interceptors.request.use(
    async (request) => {
      request.headers["Authorization"] = `Bearer ${state.accessToken}`;
      // request.headers['name'] = 'xyz';
      let isExpired = true;
      try {
        const { exp } = await jwt_decode(state.accessToken);
        // console.log("exp", exp * 1000, Date.now());
        isExpired = Date.now() >= exp * 1000;
        if (!isExpired) {
          console.log("token is not expired");
          return request;
        }
      } catch (err) {
        console.log("expired");
      }
      const accessToken = await refreshToken();
      // console.log("inside recep", state.accessToken);
      request.headers["Authorization"] = `Bearer ${accessToken}`;
      // request.headers['name'] = 'xyz';
      return request;
    },
    function (error) {
      console.log("axios error req", error);
      return Promise.reject(error);
    }
  );

  axiosA.interceptors.response.use(
    async (response) => {
      // console.log("response", response);
      if (!response.data.error && response.data.accessToken) {
        dispatch(setAuth(response.data.accessToken, true));
      }
      return response;
    },
    async (error) => {
      console.log("axios error", error, error.response?.data?.error);
      if (error.response.data.authFailed) {
        console.log("logging out because auth failed");
        dispatch(logout());
      }
      return Promise.reject(error);
    }
  );

  return axiosA;
};

export default useAxios;
