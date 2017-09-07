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


export default class TimelineBarPlanes extends React.Component {
    render() {
        const MARGIN = {
            BOTTOM: 100,
            TOP: 10,
            LEFT: 15,
            RIGHT: 60
        },
            PLANEOFFSET_X = 15,
            PLANEOFFSET_Y = 15;

        var bars = [],
            maxSize = 30,
            numPlanes = 5,
            barW = 20,
            planes = [...Array(numPlanes)].map(() => Array(0));//number of planes is static for now

        var xScale = d3ScaleTime()
            .domain(d3ArrayExtent(this.props.articleData, r => r.date))
            .range([0, this.props.width - (MARGIN.LEFT + MARGIN.RIGHT)]);

        var yScale = d3ScaleLinear()
            .domain(d3ArrayExtent(this.props.articleData, r => r.ups))
            .range([0, this.props.height - (MARGIN.TOP+MARGIN.BOTTOM)]);


        var xAxis = d3AxisBottom()
            .scale(xScale)
            .tickSize(8)
            .tickFormat(d3timeFormat("%B"));

        var xAxisAdditional = d3AxisBottom()
            .scale(xScale)
            .tickSize(2)
            .tickFormat("");

        var par = this;
        let onMouse = function (e, d) {
            d3.selectAll(".bubble").attr("class", "bubble");
            d3.select(e.target).attr("class", "bubble highlight")
            var left = e.pageX - document.getElementById('tooltip').clientWidth / 2,
            top = e.pageY - document.getElementById('tooltip').clientHeight + 100,
            score = Math.round(d.ups/1000)+"k";
            par.props.toolTip(d.date, score, d.title, d.url, top, left);
        }

        if (this.props.articleData) {
            var par = this;
            /*
            var sortedArts = this.props.articleData.slice().sort((a, b) => {
                if (a.ups > b.ups) return -1;
                if (a.ups < b.ups) return 1;
                return 0;
            });

*/  
            var bounds = d3ArrayExtent(this.props.articleData, r => r.ups),
                range = Math.abs(bounds[0]-bounds[1]),
                bandSize = range/(numPlanes-1);

            this.props.articleData.forEach((art,i)=>{
                var targetPlane = numPlanes-(Math.round(art.ups/bandSize));
                planes[targetPlane].push(<rect key={i} onClick={(e) => { onMouse(e, art) }} x={xScale(art.date)} y={par.props.height - yScale(art.ups) - MARGIN.BOTTOM} height={yScale(art.ups)} width={barW} className="bar" ></rect>)
            })

            var bar = 0,
                planeCt = 0

            while (bar <= bars.length) {
                if (planeCt >= numPlanes) {
                    planeCt = 0;
                }
                planes[planeCt].push(bars[bar]);

                planeCt++;
                bar++;
            }
        }


        return (<div>
            <svg height={this.props.height} width={this.props.width} >
                
                {planes.map((p, i) => {
                    var whichaxis = (i===planes.length-1) ? xAxis:xAxisAdditional;
                    var mouseOver = function(e){
                        document.querySelectorAll(".bar-plane").forEach((el,p)=>{
                            if (p!=i) d3.select(el).attr("class","bar-plane blur");
                        });
                    }
                    var mouseOut = function(e){
                        document.querySelectorAll(".bar-plane").forEach((el,p)=>{
                            d3.select(el).attr("class","bar-plane");
                        });
                    }
                    return (<g key={i} onMouseLeave={mouseOut} onMouseEnter={mouseOver} transform={"translate(" + i * PLANEOFFSET_X + "," + i * PLANEOFFSET_Y + ")"} className="bar-plane" >
                        <g className="xAxis" transform={"translate(0," + (this.props.height - MARGIN.BOTTOM) + ")"} ref={node => d3.select(node).call(whichaxis)} />
                        {p}</g>);
                
                    
                })}
            </svg>
        </div>
        );
    }
}

