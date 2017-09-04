import React from 'react';
import { render } from 'react-dom';
let d3 = require('d3');
import {
    scaleLinear as d3ScaleLinear,
    scaleTime as d3ScaleTime,
} from 'd3-scale';
import {
    axisBottom as d3AxisTop,
    axisLeft as d3AxisLeft,
} from 'd3-axis';
import { extent as d3ArrayExtent } from 'd3-array';
import { timeFormat as d3timeFormat } from 'd3-time-format';
import { select as d3Select } from 'd3-selection';


export default class TimelineCircleGrid extends React.Component {
    render() {
        var circles = [],
            maxSize = 30;

        var xScale = d3ScaleTime()
        .domain(d3ArrayExtent(this.props.articleData, r => r.date))
        .range([0, this.props.width]);

        var yScale = d3ScaleLinear()
            .domain(d3ArrayExtent(this.props.articleData, r => r.ups))
            .range([0, maxSize]);

        var xAxis = d3AxisTop()
            .scale(xScale)
            .tickSizeInner(300)
            .tickFormat(d3timeFormat("%B"));


        let onMouse = function(e,d){
            let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            console.log("mouse event ", e, e.pageX)
            //d3.selectAll(".bubble").attr("class", "bubble blurfocus");
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

        if (this.props.articleData.length) {
            //sort articles by date
            //start with the fist data
            //itearate thru all subsequent dates see if they are current month, if not, put into new array.
            
            var artDat = this.props.articleData.slice().sort((a,b)=>{
                if (new Date(a.date)<new Date(b.date)) return -1;
                if (new Date(a.date)>new Date(b.date)) return 1;
                return 0;
            });//slice makes it more immutable-like??
            var currMonth = artDat[0].date.getMonth();
            var tempSet = [];
            var articlesByMonth = [];

            for(var art of artDat){
                if(art.date.getMonth()==currMonth){
                    tempSet.push(art);
                }
                else{
                    currMonth = art.date.getMonth();
                    articlesByMonth.push(tempSet);
                    tempSet = [art];
                }
            }
            articlesByMonth.push(tempSet);
            
            //console.log(articlesByMonth);

            var xpos = 0,
                ypos = 0,
                minY = 30;

            circles = articlesByMonth.map(function (col) {
                xpos = col[0].date.setDate(1);
            
                return col.map((art,i)=>{
                    ypos = minY + (i*maxSize*2);
                    //console.log(xpos, ypos);
                    return (<circle key={i} onClick={(e)=>{onMouse(e,art)}} cx={xScale(xpos)} cy={ypos} r={yScale(art.ups)} className="bubble" ></circle>);
                });
                
            });
        }


        return (<div>
            <svg height={this.props.height} width={this.props.width} >
                <g className="xAxis" transform={"translate(0,20)"} ref={node => d3.select(node).call(xAxis)} />
                {circles}
            </svg>
            </div>
        );
    }
}

