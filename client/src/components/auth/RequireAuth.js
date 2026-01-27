/**
 * The RequireAuth function checks if the user is authenticated and redirects them to the login page if
 * not.
 * @param props - props is an object that contains the properties passed to the RequireAuth component.
 * In this case, it is likely that the component is being used as a wrapper around other components,
 * and the children of the RequireAuth component are being passed as props. The purpose of the
 * RequireAuth component is to check if
 * @returns The component is returning `props.children`, which refers to the child components that are
 * passed to it. This means that the RequireAuth component is acting as a wrapper around other
 * components, and it will only render those child components if the user is authenticated. If the user
 * is not authenticated, the component will redirect them to the login page.
 */
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RequireAuth = (props) => {
  const auth = useSelector((state) => state.auth.auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!auth) navigate("/login");
  }, [auth, navigate]);

  return props.children;
};

export default RequireAuth;