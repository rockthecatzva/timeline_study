import React from 'react';
import { render } from 'react-dom';
let d3 = require('d3');
import {
    scaleLinear as d3ScaleLinear,
    scaleTime as d3ScaleTime,
} from 'd3-scale';
import {
    axisBottom as d3AxisBottom,
    axisLeft as d3AxisLeft,
} from 'd3-axis';
import { extent as d3ArrayExtent } from 'd3-array';
import { timeFormat as d3timeFormat } from 'd3-time-format';
import { select as d3Select } from 'd3-selection';


export default class TimelineCircles extends React.Component {
    render() {
        var circles = [],
            minSize = 2,
            maxSize = 30;

        var xScale = d3ScaleTime()
        .domain(d3ArrayExtent(this.props.articleData, r => r.date))
        .range([0, this.props.width]);

        var yScale = d3ScaleLinear()
            .domain(d3ArrayExtent(this.props.articleData, r => r.ups))
            .range([minSize, maxSize]);

        //const selectScaledX = datum => xScale(selectX(datum));
        //const selectScaledY = datum => yScale(selectY(datum));

        var xAxis = d3AxisBottom()
            .scale(xScale)
            .tickSize(maxSize)
            .tickFormat(d3timeFormat("%B"));

        let onMouse = function(e,d){
            let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            console.log("mouse event ", e)
           // d3.selectAll(".bubble").attr("class", "bubble blurfocus");
           d3.selectAll(".bubble").attr("class", "bubble");
            d3.select(e.target).attr("class", "bubble highlight")
            document.getElementById("tool-link").setAttribute("href", d.url);
            document.getElementById("title").innerHTML = d.title;
            document.getElementById("date").innerHTML = (months[new Date(d.date).getMonth()]) + "-" + new Date(d.date).getDate();
            d3.select("#tooltip").classed("hidden", false);
  
            d3.select("#tooltip")
              .style("left", function () {
                let boxW = document.getElementById('tooltip').clientWidth / 2;
                return (e.pageX - boxW) + "px";
              })
              .style("top", function () {
                let boxH = document.getElementById('tooltip').clientHeight;
                return (e.pageY - boxH + 100) + "px";
              })
              .select("#value").text(Math.round(d.ups / 1000) + "k");
        }

        if (this.props.articleData) {
            var par = this;
            circles = this.props.articleData.map(function (c, i) {
                return (<circle key={i} onClick={(e)=>{onMouse(e,c)}} cx={xScale(c.date)} cy={par.props.height / 2} r={yScale(c.ups)} className="bubble" ></circle>);
            });
        }


        return (<div>
            <svg height={this.props.height} width={this.props.width} >
                <g className="xAxis" transform={"translate(0,"+(this.props.height/2)+")"} ref={node => d3.select(node).call(xAxis)} />
                {circles}
            </svg>
            </div>
        );
    }
}

