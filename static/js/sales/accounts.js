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

const transactFunc = async (toDate) => {
  const getTotalAmt = await fetch(`http://localhost:3000/sold/${toDate}?act=jt`);
  const resTotalAmt = await getTotalAmt.json();
  const viewAmt = resTotalAmt?.totalAmount ? resTotalAmt.totalAmount : '-';
  document.querySelector('.main-amt').innerHTML = viewAmt;
  document.querySelector('.left-head-amt').innerHTML = viewAmt;
  console.log(viewAmt);

}

const holdSold = document.querySelector('.hold-sold');
const fetchSold = async (toDate) => {
  const getData = await fetch(`http://localhost:3000/sold/${toDate}`);
  const dataRes = await getData.json();
  console.log(dataRes);
  if(dataRes?.data === 'none') return;
  const mapResData = new Map(Object.entries(dataRes));
  console.log(mapResData);
  const payMethods = [];
  mapResData.forEach((v,k) => {
    if(k === 'cash' || k === 'momo'){
      payMethods.push(v);
      return;
    }
    const fullAmt = payMethods.reduce((a,b)=>a+b,0);
    const perc = Math.floor((v.totalAmt / fullAmt) * 100);
    const list = `
      <li>
          <div class="hol-prd-img">
              <div style="background-image: url('/imgs/categ/sales/products/sold/${k}.png')" alt=""></div>
          </div>
          <span class="prd-name top-cent">${k}</span>

          <span class="all-spans">
              <span>GH₵${v.totalAmt}</span>
              <span class="load">
                  <span class="span-qty" style="width: ${perc}%"></span>
              </span>
              <span>${v.quantity}</span>
          </span>        
      </li>`;
    holdSold.insertAdjacentHTML('beforeend', list);
  })
  document.querySelector('.cash-amt').innerHTML = payMethods[0];
  document.querySelector('.momo-amt').innerHTML = payMethods[1];
  pageCharts(payMethods);
}

document.querySelector('.period-form').addEventListener('submit', function(e){
  e.preventDefault();
  const formData = new FormData(this);
  const {resinp} = Object.fromEntries(formData);
  console.log(resinp);
  if(resinp.length === 0) return;
  $('.cust-date').html('Custom : ');
  $('.cust-date').css({
    'font-size': '25px',
    'font-weight':'bold',
    'color':'green'
  });
  holdSold.innerHTML = '';
  fetchSold(resinp);
  transactFunc(resinp);
})

const [date] = new Date().toISOString().split('T');
fetchSold(date);
transactFunc(date);