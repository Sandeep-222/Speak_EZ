// App.js
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import axios from 'axios';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { useUser } from './Authenticator/Usercontext'; // Import UserContext
// import dotenv from 'dotenv';
// dotenv.config()


// Import Routes all
import { userRoutes, authRoutes } from './routes/allRoutes';

// Import all middleware
import Authmiddleware from './routes/middleware/Authmiddleware';

// layouts Format
import VerticalLayout from './components/VerticalLayout/';
import HorizontalLayout from './components/HorizontalLayout/';
import NonAuthLayout from './components/NonAuthLayout';
// Import scss
// import dotenv from 'dotenv'
import './assets/scss/theme.scss';
// dotenv.config();
const App = (props) => {
  const { user,setUser } = useUser(); // Access user state from UserContext
  const navigate=useNavigate();
  // console.log(process.env.ENDPOINT)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is authenticated
        const token=localStorage.getItem("authUser");

        if (token) {
          // Fetch data from the API using Axios with JWT token
          const response = await axios.get(`http://localhost:4000/api/getuser`, {
            headers: {
              Authorization: `${token}`
            }
          });

          // Set the fetched user data to state
          // console.log(response.data);
          setUser(response.data.user);
          //localStorage.setItem("UserData",response.data);
        }
      } catch (error) {
        if(error.response.status===401 || error.response.status===404)
          {
            setUser(null);
            localStorage.removeItem("authUser");
            navigate('login')
          }
        // console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);
  function getLayout() {
    let layoutCls = VerticalLayout;
    switch (props.layout.layoutType) {
      case 'horizontal':
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const Layout = getLayout();

  return (
    <Routes>
      {/* Non-authenticated routes */}
      {authRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <NonAuthLayout>
                {route.component}
              </NonAuthLayout>
            )
          }
        />
      ))}

      {/* Authenticated routes */}
      {userRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            
              <Authmiddleware>
                <Layout>{route.component}</Layout>
              </Authmiddleware>

          }
        />
      ))}

      {/* Redirect to dashboard if user is authenticated */}
      {/* <Route path="/" element={ user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} /> */}
    </Routes>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

const mapStateToProps = (state) => ({
  layout: state.Layout,
});

export default connect(mapStateToProps, null)(App);
