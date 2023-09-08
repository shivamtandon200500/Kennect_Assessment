import { useAlert } from "react-alert";
import { Navigate,Outlet } from "react-router-dom";
import { useStore } from "../store/store";

const ProtectedRoute = ({ children, redirectTo }) => {
  const [state] = useStore();
  // console.log(state, "state");
  const isAuthenticated = state.authenticated;
  const alert = useAlert();

  // console.log(isAuthenticated, "isAuthenticated");

  if (isAuthenticated) {
    return <Outlet/>;
  } else {
    alert.error("Please sign in first")
    return <Navigate to={redirectTo} replace/>;
  }
};

export default ProtectedRoute;
