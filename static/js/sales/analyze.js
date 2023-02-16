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

const resetClick = (btn) => {
    btn.style.cursor = 'pointer';
    btn.removeAttribute('disabled');
}

const holdTags = document.querySelector('.hol-tags'); 
const checkout = () => {
    const cartForm = document.querySelector('.cart-form');
    holdTags.addEventListener('click', (e) => {
        if(e.target.classList.contains('hol-tags')) return;
        const clickedItem = e.target;
        clickedItem.style.cursor = 'not-allowed';
        clickedItem.setAttribute('disabled', 'true')
        const itemName = e.target.dataset.name;
        const checkInput = `
                <div class="add-cart" data-assign="${itemName}">
                    <div class="hol-img">
                        <span class="hol-prd-img center" style="background-image:url('/imgs/categ/sales/products/${itemName}.jpg');"></span>
                    </div>
                    <div class="form-rep center">
                        <div class="form-row row">
                            <div class="hol-inps">
                                <label for="qty">Qty</label><br>
                                <input type="number" id="${itemName}Qty" name="${itemName}Qty" min="1">
                            </div>
                            <div class="hol-inps">
                                <label for="price">Price</label><br>
                                <input type="number" id="${itemName}Price" name="${itemName}Price" min="1">
                            </div>
                            <span class="hol-x-ico">
                                <ion-icon name="close-outline" class="x-ico center"></ion-icon>
                            </span>
                        </div>
                    </div>
                </div>
                `
        cartForm.insertAdjacentHTML('afterbegin', checkInput);
    })
}

const closeItem = () => {
    document.addEventListener('click', (e) => {
        if(!e.target.classList.contains('x-ico')) return;
        const xClickedElem = e.target.closest('.add-cart');
        const assignEl = xClickedElem.dataset.assign;
        holdTags.querySelectorAll('button').forEach(btn => (btn.dataset.name === assignEl) && resetClick(btn))
        xClickedElem.remove();
    })
}

const submitCart = () => {
    document.querySelector('.cart-form').addEventListener('submit', function(e){
        e.preventDefault();
        const data = {};
        document.querySelectorAll('.add-cart').forEach(cart => {
            const assignCart = cart.dataset.assign;
            data[assignCart] = [];
            const itemInps = cart.querySelectorAll('input');
            itemInps.forEach(inp => data[assignCart].push(inp.value));
        })
        // console.log(data);
        $.ajax({
            url: 'http://localhost:3000/checkout',
            method: 'POST',
            data: data,
            success: (res) => {
                console.log(res);
            }

        })
    })
    const checkoutOverlay = document.querySelector('.checkout-overlay');
    // open checkout dialog
    document.querySelector('.checkout-btn').addEventListener('click', ()=> {
        checkoutOverlay.style.display = 'block';
    })

    // close checkout dialog
    document.querySelector('.close-btn').addEventListener('click', ()=>{
        document.querySelectorAll('.add-cart').forEach(el=>el.remove());
        holdTags.querySelectorAll('button').forEach(btn=>resetClick(btn));
        checkoutOverlay.style.display = 'none';
    })
}



allCharts();
checkout();
closeItem();
submitCart();