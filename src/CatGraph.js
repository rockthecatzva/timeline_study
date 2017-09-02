import React from 'react';
import {render} from 'react-dom';
import d3 from 'd3';

export default class CatGraph extends React.Component {
    render(){
        let circles = [...this.props.circles.keys()].map(function(c,i){
            return (<circle key={i} cx={i*10} cy={i*10} r="10"></circle>);
        });

        return (
            <svg>
                {circles}
            </svg>
                );
    }
}

