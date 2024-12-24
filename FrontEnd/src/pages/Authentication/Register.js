import React, { useEffect, useState } from 'react'
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-dark.png";


import { Link, useNavigate } from "react-router-dom";
import { Alert, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from 'reactstrap';
import axios from 'axios';

const Register = props => {
  //meta title
  document.title = "Register | Skote - React Admin & Dashboard Template";

  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loggedin,setlogin]=useState(false);
  const [registrationError,setRegistrationError]=useState(null);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    // enableReinitialize: true,

    initialValues: {
      email: '',
      first_name: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      first_name: Yup.string().required("Please Enter Your Username"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async(values) => {
      // const EndpointURL=process.env.EndpointURL;
      // dispatch(registerUser(values));
      try {
        console.log(values);
        const response = await axios.post(`${process.env.ENDPOINT}/auth/register`, values);
        if (response.data.loggedin) {
          setlogin(true);
          navigate('/login');
        } else {
          setRegistrationError(response.data.message);
        }
      } catch (error) {
        // Handle error
        console.error("Registration error:", error);
        setRegistrationError("An error occurred during registration. Please try again later.");
      }
    }
  });



  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5}>
                        <Card className="overflow-hidden">
                            <CardBody className="pt-0">
                                <h3 className="text-center mt-5 mb-4">
                                    <Link to="/" className="d-block auth-logo">
                                        <img src={logoDark} alt="" height="30" className="auth-logo-dark" />
                                        <img src={logoLight} alt="" height="30" className="auth-logo-light" />
                                    </Link>
                                </h3>
                                <div className="p-3">
                                    <h4 className="text-muted font-size-18 mb-1 text-center">Free Register</h4>
                                    <p className="text-muted text-center">Get your free SpeakEZ account now.</p>
                                    <Form
                                      className="form-horizontal mt-4"
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        validation.handleSubmit();
                                        return false;
                                      }}
                                    >
                                      {loggedin && loggedin ? (
                                        <Alert color="success">
                                          Register User Successfully
                                        </Alert>
                                      ) : null}

                                      {registrationError && registrationError ? (
                                        <Alert color="danger">{registrationError}</Alert>
                                      ) : null}

                                        <div className="mb-3">
                                            <Label htmlFor="useremail">Email</Label>
                                            <Input
                                              id="email"
                                              name="email"
                                              className="form-control"
                                              placeholder="Enter email"
                                              type="email"
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              value={validation.values.email || ""}
                                              invalid={
                                                validation.touched.email && validation.errors.email ? true : false
                                              }
                                            />
                                            {validation.touched.email && validation.errors.email ? (
                                              <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                            ) : null}
                                        </div>

                                        <div className="mb-3">
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                              name="first_name"
                                              type="text"
                                              placeholder="Enter username"
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              value={validation.values.first_name || ""}
                                              invalid={
                                                validation.touched.first_name && validation.errors.first_name ? true : false
                                              }
                                            />
                                            {validation.touched.first_name && validation.errors.first_name ? (
                                              <FormFeedback type="invalid">{validation.errors.first_name}</FormFeedback>
                                            ) : null}
                                        </div>

                                        <div className="mb-3">
                                            <Label htmlFor="userpassword">Password</Label>
                                            <Input
                                              name="password"
                                              type="password"
                                              placeholder="Enter Password"
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              value={validation.values.password || ""}
                                              invalid={
                                                validation.touched.password && validation.errors.password ? true : false
                                              }
                                            />
                                            {validation.touched.password && validation.errors.password ? (
                                              <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                            ) : null}
                                        </div>

                                        <div className="mb-3 row mt-4">
                                            <div className="col-12 text-end">
                                                <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Register</button>
                                            </div>
                                        </div>

                                        <div className="mb-0 row">
                                            <div className="col-12 mt-4">
                                                <p className="text-muted mb-0 font-size-14">By registering you agree to the SpeakEZ <Link to="#" className="text-primary">Terms of Use</Link></p>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </CardBody>
                        </Card>
                        <div className="mt-5 text-center">
                            <p>Already have an account ? <Link to="/login" className="text-primary"> Login </Link> </p>
                            © <script>document.write(new Date().getFullYear())</script> SpeakEZ <span className="d-none d-sm-inline-block"> - Crafted with <i className="mdi mdi-heart text-danger"></i> </span>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
      
    </React.Fragment>
  )
}

export default Register
