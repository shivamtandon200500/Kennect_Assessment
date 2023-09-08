import { Navigate,Outlet } from "react-router-dom";
import { useStore } from "../store/store";

const OnlyUnauthRoute = ({ children, redirectTo }) => {
  const [state] = useStore();
//   console.log(state, "state");
  const isAuthenticated = state.authenticated;

  // console.log(isAuthenticated, "isAuthenticated");

  if (!isAuthenticated) {
    return <Outlet/>;
  } else {
    return <Navigate to={redirectTo} replace/>;
  }
};

export default OnlyUnauthRoute;
