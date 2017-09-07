import React from 'react';
import { render } from 'react-dom';
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
import { select } from 'd3-selection';
import { timeFormat as d3timeFormat } from 'd3-time-format';


import Circles from './TimelineCircles.js'
import CircleGrid from './TimelineCircleGrid.js'
import Bars from './TimelineBars.js'
import BarPlanes from './TimelineBarPlanes.js'


class App extends React.Component {
    constructor(props) {
        super(props);
        //height and width dont need to be state!!
        this.state = { articleData: new Array(0) };

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
                    var articles = await fetch("https://oauth.reddit.com/r/news/search.json?sort=best&t=year&limit=35&restrict_sr=on&syntax=cloudsearch", { headers: { 'Authorization': 'bearer ' + data.access_token } });
                    var articleData = await articles.json();
                    var finalData = articleData.data.children.map(r => {
                        return Object.assign({}, { "date": new Date(r.data["created_utc"] * 1000), "url": r.data["url"], "ups": r.data["ups"], "title": r.data["title"] });
                    });

                    //console.log(finalData);
                    this.setState({
                        "articleData": finalData
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
        var width = 600,
            height = 80;

        var toolTip = function(date, score, title, url, top, left){
                let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                document.getElementById("tool-link").setAttribute("href", url);
                document.getElementById("title").innerHTML = title;
                document.getElementById("date").innerHTML = (months[new Date(date).getMonth()]) + "-" + new Date(date).getDate();
                document.getElementById("tooltip").classList.remove("hide");
                document.getElementById("tooltip").style.left = left;
                document.getElementById("tooltip").style.top = top;
                
            }

        var closeTooltip = function(){
            document.getElementById("tooltip").className = "tooltip hide";
            console.log("here");
        }
        

        return (<div>
            <h3>Bubbles on a Timeline</h3>
            <p>This is copied over from my <a href="http://rockthecatzva.com/reddit-bubbles/" >previous project</a>. A simple circle time-line graph ideally suited for displaying only a few non-overlapping values.</p>
            <Circles articleData={this.state.articleData} height={100} width={width} toolTip={toolTip} />
            <h3>Monthly Histogram Bubbles</h3>
            <p>Breaking out the cricle time-line into a histogram.</p>
            <CircleGrid articleData={this.state.articleData} height={500} width={width} toolTip={toolTip} />
            <h3>Bars</h3>
            <Bars articleData={this.state.articleData} height={300} width={width} toolTip={toolTip} />
            <h3>Bars on Planes</h3>
            <p>I know how much everyone likes 3d bar charts (sarcasm?), so I figured why not 2.5d? The data is split into several bands depending on the score. The articles with the highest scores are placed in the furthest plane as to not obstruct smaller scoring content. The use of planes does reduce some of the visual clutter. Mouse-over a bar to highlight its entire plane, click for more info.</p>
            <BarPlanes articleData={this.state.articleData} height={300} width={width} toolTip={toolTip} />



            <div id="tooltip" className="hide">
                <div className="close-container">
                    <button id="close-box" className="btn btn-clear float-right" onClick={closeTooltip} ></button>
                </div>
                <div className="tool-toprow">
                    <span id="date">4/18</span>
                    <span className="tool-score" id="value">1k</span>
                </div>
                <div className="divider"></div>
                <div className="tool-title" id="title">Title</div>
                <a id="tool-link" target="_blank" className="btn" href="#">Link</a>

            </div>
        </div>);
    }
}


render(<App />, document.getElementById('app'));