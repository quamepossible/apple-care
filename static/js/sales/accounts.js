var transChart = echarts.init(document.getElementById('trans-chart'));

const pageCharts = () => {
    option = {
        xAxis: {
          type: 'category',
          data: ['Cash', 'Momo']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
    };
    transChart.setOption(option)
}


pageCharts();