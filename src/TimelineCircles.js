import React from 'react';
import { render } from 'react-dom';
let d3 = require('d3');

export default class TimelineCircles extends React.Component {
    render() {
        var divStyle = {
            fill: 'red',

        };

        let circles = [];

        if (this.props.maxDate) {
            var par = this;
            circles = this.props.articleData.map(function (c, i) {
                return (<circle key={i} style={divStyle} cx={par.props.xScale(c.date)} cy={par.props.height / 2} r={par.props.yScale(c.ups)} ></circle>);
            });
        }


        return (
            <svg height="100%" width="100%" >
                {circles}
            </svg>
        );
    }
}

