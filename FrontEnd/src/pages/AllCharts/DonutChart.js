import React, { Component } from 'react';

import C3Chart from 'react-c3js';
import 'c3/c3.css';

class DonutChart extends Component {

    render() {
        const {user}=this.props;
        // console.log(user)
        const data = {
            columns: [
                ['AI interviews',user.No_AI_interview],
                ['Written test', user.No_Written_test],
                ['Voice tests', user.No_Voice_test]
            ],
            type: "donut",
        };

        const donut = {
            title: "All Tests",
            width: 30,
            label: { show: !1 }
        };

        const color = {
            pattern: ['#f0f1f4', '#7a6fbe', '#28bbe3']
        };

        const size = {
            height: 300
        };

        return (
            <React.Fragment>
                <C3Chart data={data} donut={donut} color={color} size={size} dir="ltr" />
            </React.Fragment>
        );
    }
}

export default DonutChart;