import React, { Component } from 'react';
import { Row, Col, Card, CardBody } from "reactstrap";
import ReactApexChart from 'react-apexcharts';
// import { useUser } from 'Authenticator/Usercontext';
class MonthlyEarnings extends Component {
    constructor(props) {
        super(props);
        const {user}=this.props;
        // console.log(user);
        this.state = {
            options: {
                colors: ['#ccc', '#7a6fbe', 'rgb(40, 187, 227)'],
                chart: {
                    toolbar: {
                        show: !1,
                    },
                },
                dataLabels: {
                    enabled: !1
                },
                stroke: {
                    curve: 'smooth',
                    width: 0.1,
                },
                grid: {
                    borderColor: '#f8f8fa',
                    row: {
                        colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: ['JAN', 'FEB', 'MAR' , 'APR', 'MAY', 'JUN', 'JUL','AUG','SEP','OCT','NOV','DEC'],
                    axisBorder: {
                        show: !1
                    },
                    axisTicks: {
                        show: !1
                    }
                },
                legend: {
                    show: !1
                },
            },
            series: [
                {
                    name: 'AI intervies',
                    data: user.AI_interview_monthlyScores,
                },
                {
                    name: 'Written Tests',
                    data: user.Written_test_monthlyScores,
                    
                },
                {
                    name: 'Voice Tests',
                    data: user.Voice_test_monthlyScores,
                }
            ],
        }
    }
    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <h4 className="card-title mb-4">Streak</h4>

                        <Row className="text-center mt-4">
                            <Col xs="4">
                                {/* <h5 className="font-size-20">$ 89425</h5> */}
                                <p className="text-muted">AI Interviews</p>
                            </Col>
                            <Col xs="4">
                                {/* <h5 className="font-size-20">$ 56210</h5> */}
                                <p className="text-muted">Written Tests</p>
                            </Col>
                            <Col xs="4">
                                {/* <h5 className="font-size-20">$ 8974</h5> */}
                                <p className="text-muted">Voice Tests</p>
                            </Col>
                        </Row>

                        <div id="morris-area-example" className="morris-charts morris-charts-height" dir="ltr">
                            <ReactApexChart options={this.state.options} series={this.state.series} type="area" height="300" />
                        </div>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default MonthlyEarnings;