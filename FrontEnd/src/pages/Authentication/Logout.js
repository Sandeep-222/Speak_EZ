import React, { useEffect } from "react";
import PropTypes from "prop-types";
import withRouter from "components/Common/withRouter";
import { logoutUser } from "../../store/actions";
import { useUser } from "Authenticator/Usercontext";
//redux
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const {setUser}=useUser();
  useEffect(() => {
    const handleLogout = async () => {
      // Clear user authentication data from local storage
      localStorage.removeItem("authUser");
      setUser(null);
      // history.clear();
      history('/login')
    };

    // Call handleLogout function
    handleLogout();
  }, []);

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);
