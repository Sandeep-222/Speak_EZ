import React , {useEffect,useState} from "react"

import { connect } from "react-redux";
import {
  Row,
  Col,
} from "reactstrap"

// Pages Components
import Miniwidget from "./Miniwidget"
import MonthlyEarnings from "./montly-earnings";
import EmailSent from "./email-sent";
import MonthlyEarnings2 from "./montly-earnings2";
import Inbox from "./inbox";
import RecentActivity from "./recent-activity";
import WidgetUser from "./widget-user";
import YearlySales from "./yearly-sales";
import LatestTransactions from "./latest-transactions";
import LatestOrders from "./latest-orders";

//Import Action to copy breadcrumb items from local state to redux state
import { setBreadcrumbItems } from "../../store/actions";
import { useUser } from "Authenticator/Usercontext";
const Dashboard = (props) => {
 const {user}=useUser();
  const [isLoading, setIsLoading] = useState(true);

  document.title = "Dashboard";

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);
  document.title = "Dashboard";
  // console.log(user);
  const breadcrumbItems = [
    { title: "", link: "#" },
    { title: "Dashboard", link: "#" }
  ]

  useEffect(() => {
    props.setBreadcrumbItems('Dashboard' , breadcrumbItems)
  },[])
  if (isLoading) {
    return <div>Loading...</div>; // Or any loading indicator
  }
  const reports = [
    { title: "Total Tests", iconClass: "cube-outline", total: user.Total_tests },
    { title: "AI interviews", iconClass: "buffer", total:user.No_AI_interview},
    { title: "Written Tests", iconClass: "tag-text-outline", total:user.No_Written_test },
    { title: "Vocal Tests", iconClass: "briefcase-check", total:user.No_Voice_test  },
  ]

  return (
    <React.Fragment>

      {/*mimi widgets */}
      <Miniwidget reports={reports} />

      <Row>
        <Col xl="3">
          {/* Monthly Earnings */}
          <MonthlyEarnings />
        </Col>

        <Col xl="9">
          {/* Email sent */}
          <EmailSent user={user}/>
        </Col>

        <Col xl="3">
          {/* <MonthlyEarnings2 /> */}
        </Col>

      </Row>
      <Row>

        <Col xl="4" lg="6">
          {/* inbox */}
        </Col>
        <Col xl="4" lg="6">
          {/* recent activity */}
          {/* <RecentActivity /> */}

        </Col>
        <Col xl="4">
          {/* widget user */}
          {/* <WidgetUser /> */}

          {/* yearly sales */}
          {/* <YearlySales /> */}
        </Col>
      </Row>

      <Row>
        <Col xl="6">
          {/* latest transactions */}
          <LatestTransactions />
        </Col>

        <Col xl="6">
          {/* latest orders */}
          <LatestOrders />
        </Col>
      </Row>

    </React.Fragment>
  )
}

export default connect(null, { setBreadcrumbItems })(Dashboard);