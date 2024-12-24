import React from "react"
import { Card, CardBody, Row,  CardTitle } from "reactstrap"
import DonutChart from '../AllCharts/DonutChart';
import { useUser } from "Authenticator/Usercontext";
const MonthlyEarnings = props => {
    const {user}=useUser();
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <CardTitle className="h4 mb-4">Overview</CardTitle>

                    <Row className="text-center mt-4">
                        <div className="col-6">
                            <h5 className="font-size-20">{user.No_AI_interview}</h5>
                            <p className="text-muted">AI Interviews</p>
                        </div>
                        <div className="col-6">
                            <h5 className="font-size-20">{user.No_Written_test}</h5>
                            <p className="text-muted">Written Tests</p>
                        </div>
                    </Row>
                    <div dir="ltr">
                        <DonutChart user={user}/>
                    </div>

                </CardBody>
            </Card>
        </React.Fragment>
    )

}

export default MonthlyEarnings
