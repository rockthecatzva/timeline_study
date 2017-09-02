import React from 'react';
import {render} from 'react-dom';
let d3 = require('d3');

export default class TimelineCircles extends React.Component {
    render(){
        console.log(this.props);
        let formatDate = d3.timeFormat("%d-%b-%y");
        let height = 10,
          MAXBALLOON_SIZE = 30,
          ROW_GAP = 100,
          ypos = 40,
          tooltipBuffer = -15,
          margin = { top: 20, right: 30, bottom: 40, left: 100 };
          //containerW = parseInt((window.getComputedStyle(svgTarget).width).replace("px", "")),
          //containerH = parseInt((window.getComputedStyle(svgTarget).height).replace("px", ""));

        let circles = [...this.props.articleData.keys()].map(function(c,i){
            return (<circle key={i} cx={i*10} cy={i*10} r="10"></circle>);
        });

        return (
            <svg height="100%" width="100%" >
                {circles}
            </svg>
                );
    }
}

