import React, { useState } from "react"
import PropTypes from 'prop-types'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

//i18n
import { withTranslation } from "react-i18next"
// Redux
import { connect } from "react-redux"
import {  Link, useNavigate } from "react-router-dom";
import withRouter from "components/Common/withRouter"
import { useUser } from "Authenticator/Usercontext"
// users
import user1 from "../../../assets/images/users/user-1.jpg"
import Logout from "pages/Authentication/Logout"

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)
  const navigate=useNavigate()
  const {user}=useUser();
  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/profile">
            {" "}
            <i className="mdi mdi-account-circle font-size-17 text-muted align-middle me-1"/>
            {props.t("Profile")}{" "}
          </DropdownItem>
          <DropdownItem className="d-flex align-items-center" to="#">
            <i className="mdi mdi-cog font-size-17 text-muted align-middle me-1"></i>
            {props.t("Settings")}<span className="badge bg-success ms-auto">11</span></DropdownItem>
          <DropdownItem  className="text-danger" tag="a" href="/logout">
            <i className="mdi mdi-power font-size-17 text-muted align-middle me-1 text-danger" />
            <span >{props.t("Logout")}</span>
          </DropdownItem>
          {/* <div className="dropdown-divider"/>
          <Link to="/logout" className="dropdown-item text-danger">
            <i className="mdi mdi-power font-size-17 text-muted align-middle me-1 text-danger"/>
            <span>logout</span>
          </Link> */}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
)