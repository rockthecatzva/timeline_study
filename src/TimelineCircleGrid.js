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
        const MARGIN = {
            BOTTOM: 150,
            TOP: 40,
            LEFT: 15,
            RIGHT: 15
        }

        var circles = [],
            minSize = 2,
            maxSize = 30,
            minDate = new Date(Math.min.apply(null, this.props.articleData.map(art=>art.date))).setDate(1),
            maxDate = Math.max.apply(null, this.props.articleData.map(art=>art.date));

        console.log(minDate, new Date(minDate).setDate(1))
        var xScale = d3ScaleTime()
        .domain([minDate, maxDate])
        .range([MARGIN.LEFT, this.props.width-MARGIN.RIGHT]);

        var yScale = d3ScaleLinear()
            .domain(d3ArrayExtent(this.props.articleData, r => r.ups))
            .range([minSize, maxSize]);

        var xAxis = d3AxisTop()
            .scale(xScale)
            .tickSizeInner(300)
            .tickFormat(d3timeFormat("%B"));

        var par = this;
        let onMouse = function(e,d){
            d3.selectAll(".bubble").attr("class", "bubble");
            d3.select(e.target).attr("class", "bubble highlight")
            var left = e.pageX - document.getElementById('tooltip').clientWidth / 2,
            top = e.pageY - document.getElementById('tooltip').clientHeight + 100,
            score = Math.round(d.ups/1000)+"k";
            par.props.toolTip(d.date, score, d.title, d.url, top, left);
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
            

            var xpos = 0,
                ypos = 0,
                minY = 30,
                prevRadius = 0;

            circles = articlesByMonth.map(function (col) {
                xpos = col[0].date.setDate(1);
                
                ypos = minY;
                prevRadius = 0;

                return col.map((art,i)=>{
                    ypos +=(yScale(art.ups)+yScale(prevRadius));
                    prevRadius = (art.ups);
                    
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

