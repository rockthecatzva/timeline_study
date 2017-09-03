import React from 'react';
import { render } from 'react-dom';
import Circles from './TimelineCircles.js'
let CryptoJS = require("crypto-js");
import { extent as d3ArrayExtent } from 'd3-array';
import {
    scaleLinear as d3ScaleLinear,
    scaleTime as d3ScaleTime,
} from 'd3-scale';
import {
    axisBottom as d3AxisBottom,
    axisLeft as d3AxisLeft,
  } from 'd3-axis';
  import { select as d3Select } from 'd3-selection';
  import {timeFormat as d3timeFormat} from 'd3-time-format';




class App extends React.Component {
    constructor(props) {
        super(props);
        //height and width dont need to be state!!
        this.state = { circles: new Array(10), articleData: new Array(0), maxDate: 0, minDate: null };
        
        //get auth token & request data from 
        (async () => {
            let url = "https://www.reddit.com/api/v1/access_token";
            try {
                var response = await fetch(url, {
                    method: "post",
                    headers: {
                        'Authorization': "Basic " + CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse("TGuKx4Fkfb7ivQ:")),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: "grant_type=https://oauth.reddit.com/grants/installed_client&device_id=DO_NOT_TRACK_THIS_DEVICE"
                });

                var data = await response.json();

                try {
                    var articles = await fetch("https://oauth.reddit.com/r/news/search.json?sort=top&t=year&limit=35&restrict_sr=on&syntax=cloudsearch", { headers: { 'Authorization': 'bearer ' + data.access_token } });
                    var articleData = await articles.json();
                    var finalData = articleData.data.children.map(r => {
                        return Object.assign({}, { "date": new Date(r.data["created_utc"] * 1000), "url": r.data["url"], "ups": r.data["ups"], "title": r.data["title"] });
                    });

                    //console.log(finalData);
                    this.setState({
                        "articleData": finalData,
                        "maxDate": Math.max.apply(null, finalData.map(d => { return d["date"] })),
                        "minDate": Math.min.apply(null, finalData.map(d => { return d["date"] }))
                    });
                } catch (f) {
                    console.log("the auth worked, but request for data failed", f);
                }
            } catch (e) {
                console.log("the initial auth request was rejected", e)
            }
        })();
    }


    render() {
        var xAxis = () => {},
            yAxis = () => {},
            width = 600,
            height = 80,
            maxSize = 30,
            xScale = () => {},
            yScale = () => {};


        if(this.state.minDate && this.state.maxDate){
            console.log("building the axis!",d3ArrayExtent(this.state.articleData, r=> r.ups) )
             xScale = d3ScaleTime()
                .domain(d3ArrayExtent(this.state.articleData, r=> r.date))
                .range([0, width]);
    
             yScale = d3ScaleLinear()
                .domain(d3ArrayExtent(this.state.articleData, r=> r.ups))
                .range([0, maxSize]);
    
            //const selectScaledX = datum => xScale(selectX(datum));
            //const selectScaledY = datum => yScale(selectY(datum));
            
            xAxis = d3AxisBottom()
            .scale(xScale)
            .tickFormat(d3timeFormat("%B"));
            // Add an axis for our y scale that has 3 ticks (FIXME: we should probably make number of ticks per axis a prop).
            //yAxis = d3AxisLeft()
            //.scale(yScale)
            //.ticks(3);
        }
        

        return (<div>
            <p>Hello Reacted!</p>
              
                
                {(this.state.articleData) && 
                    <svg height={height} width={width} >
                        <g className="xAxis" ref={node => d3Select(node).call(xAxis)} />
                    </svg>
                }
            
            <Circles {...Object.assign({},this.state, {"width": width, "height": height, "xScale":(v)=>{return xScale(v)}, "yScale":(v)=>{return yScale(v)}      })} />
        </div>);
    }
}


render(<App />, document.getElementById('app'));