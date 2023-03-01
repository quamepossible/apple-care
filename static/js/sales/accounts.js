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

const transactFunc = async () => {
  const toDate = new Date().toISOString().split('T')[0];
  const getTotalAmt = await fetch(`http://localhost:3000/sold/${toDate}`);
  const resTotalAmt = await getTotalAmt.json();
  const viewAmt = resTotalAmt?.totalAmount ? resTotalAmt.totalAmount : 'N/A';
  document.querySelector('.main-amt').innerHTML = viewAmt;
  console.log(viewAmt);

}



transactFunc();
pageCharts();