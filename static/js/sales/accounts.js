var transChart = echarts.init(document.getElementById('trans-chart'));

const pageCharts = (payMeths) => {
    option = {
        xAxis: {
          type: 'category',
          data: ['Cash', 'Momo']
        },
        yAxis: {
          // type: 'value'
          show: false,
        },
        series: [
          {
            data: payMeths,
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
  const viewAmt = resTotalAmt?.totalAmount ? resTotalAmt.totalAmount : '-';
  document.querySelector('.main-amt').innerHTML = viewAmt;
  document.querySelector('.left-head-amt').innerHTML = viewAmt;
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
  const paymentTypes = new Map();
  const payMethods = [];
  // paymentTypes.forEach(pay => payMethods.push(pay));
  mapResData.forEach((v,k) => {
    if(k === 'cash' || k === 'momo'){
      // paymentTypes.set(k, v);
      payMethods.push(v);
      return;
    }
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
              <span>${v.quantity}</span>
          </span>        
      </li>`;
    holdSold.insertAdjacentHTML('beforeend', list);
  })
  console.log(paymentTypes);
  // const payMethods = [];
  // paymentTypes.forEach(pay => payMethods.push(pay));
  console.log(payMethods);
  document.querySelector('.cash-amt').innerHTML = payMethods[0];
  document.querySelector('.momo-amt').innerHTML = payMethods[1];
  pageCharts(payMethods);
}


fetchSold();
transactFunc();