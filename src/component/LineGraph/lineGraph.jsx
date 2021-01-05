import { options } from 'numeral';
import React from 'react';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral'

//data is from  https://disease.sh/v3/covid-19/historical/all?lastdays=120

class LineGraph extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            data: {}
        }
    }
    buildChartData = (data,casesType) => {
        let chartData = [];
        let lastDataPoint;
        for(let date in data.cases) {
            if(lastDataPoint) {
                let newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                    chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date]
        }
        return chartData;
    }

    fetchData = async () => {
        await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then(response => response.json())
        .then(data => {
            let chartData = this.buildChartData(data, this.props.casesType);
            this.setState({
                data: chartData
            })
        })
    }
    
    componentDidUpdate() {
        
        
        this.fetchData();
    }
    render() {
        // The code below isfrom chartjs .... :)
        const options = {

            legend: {
                display: false
            },
            elements: {
                points: {
                    radius: 0,
                },
            },
            maintainAspectRatio: false,
            tooltips: {
                node: "index",
                intersect: false,
                callbacks: {
                    label: function(tooltipItem, data) {
                        return numeral(tooltipItem.value).format('+0.0');
                    },
                },
            },
            scales: {
                xAxes: [
                    {
                        type: 'time',
                        time: {
                            format: 'MM/DD/YY',
                            tooltipFormat: 'll',
                        },
                    },
                ],
                yAxes: [
                    {
                        gridLines: {
                            display: false,
                        },
                        ticks: {
                            callback: function(value, index, values) {

                                return numeral(value).format('0a');
                            },

                            
                        },
                    },
                ],

            },
        };
        
        const { data } = this.state;
        return (
            <div>
                { data.length > 0 && (
                    <Line
                    data = {{ 
                        datasets: [
                            {

                            backgroundColor: "rgba(204, 16, 52, 0.5)",
                            borderColor: '#CC1034',
                            data: data,
                            },

                        ],
                    }}
                    options = {options}
                    />
                ) 
                }
                {/* the code above is from chartjs .. :) */}
            </div>
        )
    }
} 



export default LineGraph;