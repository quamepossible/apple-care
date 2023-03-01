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
  const getTotalAmt = await fetch(`http://localhost:3000/sold/${toDate}?act=jt`);
  const resTotalAmt = await getTotalAmt.json();
  const viewAmt = resTotalAmt?.totalAmount ? resTotalAmt.totalAmount : 'N/A';
  document.querySelector('.main-amt').innerHTML = viewAmt;
  console.log(viewAmt);

}

const fetchSold = async () => {
  const holdSold = document.querySelector('.hold-sold');
  const date = new Date().toISOString().split('T')[0];
  const getData = await fetch(`http://localhost:3000/sold/${date}`);
  const dataRes = await getData.json();
  console.log(dataRes);
  if(dataRes?.data === 'none') return;
  const mapResData = new Map(Object.entries(dataRes));
  console.log(mapResData);

  mapResData.forEach((v,k) => {
    const list = `
      <li>
          <div class="hol-prd-img">
              <div style="background-image: url('/imgs/categ/sales/products/sold/${k}.png')" alt=""></div>
          </div>
          <span class="prd-name top-cent">${k}</span>

          <span class="all-spans">
              <span>GH₵${v.totalAmt}</span>
              <span class="load">
                  <span class="span-qty"></span>
              </span>
              <span>41%</span>
          </span>        
      </li>`;
    holdSold.insertAdjacentHTML('beforeend', list);
  })
}


fetchSold();
transactFunc();
pageCharts();