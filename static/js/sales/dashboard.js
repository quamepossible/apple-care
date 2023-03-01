'use strict';

// market share chart
var shareChart = echarts.init(document.getElementById('share'));
var recChart = echarts.init(document.getElementById('rec-chart'));

const allCharts = () => {
    var lineOption = {
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '46%'],
                avoidLabelOverlap: false,
                label: {
                show: false,
                position: 'center'
                },
                emphasis: {
                label: {
                    show: true,
                    fontSize: 20,
                    fontWeight: 'bold'
                }
                },
                labelLine: {
                show: false
                },
                data: [
                { value: 1048, name: 'Phones' },
                { value: 735, name: 'Chargers' },
                { value: 580, name: 'Protectors' },
                ]
            }
        ],
        color : [
            'rgb(0, 92, 197)',
            'rgb(0, 171, 214)',
            'rgb(228, 228, 228)'
        ]
    };
    shareChart.setOption(lineOption);
    
    
    // History Chart
    var hisLine = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
        {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
        }
        ]
    }
    recChart.setOption(hisLine);
}

allCharts();