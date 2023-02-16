var myChart = echarts.init(document.getElementById('stock-chart'));

var option = {
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Phones' },
        { value: 735, name: 'Chargers' },
        { value: 580, name: 'Protectors' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ],
  color : [
      'rgb(0, 92, 197)',
      'rgb(0, 171, 214)',
      'rgb(228, 228, 228)'
  ]
};
myChart.setOption(option);

