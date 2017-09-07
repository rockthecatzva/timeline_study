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


export default class TimelineBars extends React.Component {
    render() {
        const MARGIN = {
            BOTTOM: 40,
            TOP: 40,
            LEFT: 15,
            RIGHT: 15
        }
        var bars = [],
            maxSize = 30;

        var xScale = d3ScaleTime()
            .domain(d3ArrayExtent(this.props.articleData, r => r.date))
            .range([0, this.props.width-MARGIN.LEFT-MARGIN.RIGHT]);

        var yScale = d3ScaleLinear()
            .domain(d3ArrayExtent(this.props.articleData, r => r.ups))
            .range([0, this.props.height-MARGIN.TOP]);


        var xAxis = d3AxisBottom()
            .scale(xScale)
            .tickSize(8)
            .tickFormat(d3timeFormat("%B"));
        
        var par = this;
        
        let onMouse = function (e, d) {
            d3.selectAll(".bubble").attr("class", "bubble");
            d3.select(e.target).attr("class", "bubble highlight");
            var left = e.pageX - document.getElementById('tooltip').clientWidth / 2,
            top = e.pageY - document.getElementById('tooltip').clientHeight + 100,
            score = Math.round(d.ups/1000)+"k";
            par.props.toolTip(d.date, score, d.title, d.url, top, left);
        }

        if (this.props.articleData) {
            var sortedArts = this.props.articleData.slice().sort((a,b)=>{
                if(a.ups>b.ups) return -1;
                if(a.ups<b.ups) return 1;
                return 0;})
            bars = sortedArts.map(function (c, i) {
                return (<rect key={i} onClick={(e) =>{onMouse(e,c)}} x={xScale(c.date)} y={par.props.height-yScale(c.ups)-MARGIN.BOTTOM} height={yScale(c.ups)} width="20" className="bar" ></rect>);
            });
        }


        return (<div>
            <svg height={this.props.height} width={this.props.width} >
                <g className="xAxis" transform={"translate(0," + (this.props.height-MARGIN.BOTTOM) + ")"} ref={node => d3.select(node).call(xAxis)} />
                {bars}
            </svg>
        </div>
        );
    }
}

