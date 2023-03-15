const resetClick = (btn) => {
    btn.style.cursor = 'pointer';
    btn.querySelector('.tag-over').classList.remove('isclicked');
    btn.querySelector('.tag-over').style.border = "none";
    btn.style.border = "2px solid white";
}

const holdTags = document.querySelector('.hol-tags'); 
const checkout = () => {
    const cartForm = document.querySelector('.cart-form');
    holdTags.addEventListener('click', (e) => {
        if(!e.target.closest('.tag-par') || e.target.classList.contains('isclicked')) return;
        const clickedBtn = e.target.closest('.tag-par');
        e.target.style.border = '2px solid red'
        clickedBtn.style.cursor = 'not-allowed';
        clickedBtn.style.border = 'none';
        e.target.classList.add('isclicked');
        
        const itemName = clickedBtn.dataset.name;
        const checkInput = `
                <div class="add-cart" data-assign="${itemName}">
                    <div class="hol-img">
                        <span class="hol-prd-img center" style="background-image:url('/imgs/categ/sales/products/sold/${itemName}.png');"></span>
                    </div>
                    <div class="form-rep center">
                        <div class="form-row row">
                            <div class="hol-inps">
                                <label for="qty">Qty</label><br>
                                <div class="hol-qty-spans">
                                    <button type="button" data-symbol="min" class="s-circs minus">
                                        <ion-icon class="center" name="remove-outline"></ion-icon>
                                    </button>
                                    <button type="button" class="s-sqrs">
                                        <span class="center qty">0</span>
                                    </button>
                                    <button type="button" data-symbol="add" class="s-circs plus">
                                        <ion-icon class="center" name="add-outline"></ion-icon>
                                    </button>
                                </div>
                                
                            </div>
                            <div class="hol-inps">
                                <label for="price">Price</label><br>
                                <input type="number" id="price" name="price" class="price" min="1">
                            </div>

                            <div class="hol-table">
                                <table class="center">
                                    <tr class="opt-row">
                                        <td>Cash</td>
                                        <td class="mid">Momo</td>
                                        <td>Total</td>
                                    </tr>
                                    <tr>
                                        <td class="cash-val">-</td>
                                        <td class="momo-val mid">-</td>
                                        <td class="total-val">0</td>
                                    </tr>
                                </table>
                            </div>

                            <div class="hol-inps">
                                <label for="">Notes (optional)</label><br>
                                <input type="text" id="note" name="note">
                            </div>
                            <span class="hol-x-ico">
                                <ion-icon name="close-outline" class="x-ico center"></ion-icon>
                            </span>
                        </div>
                    </div>
                </div>
                `
        cartForm.insertAdjacentHTML('beforeend', checkInput);
        eachProductFunc();
    })
}

const closeItem = () => {
    document.addEventListener('click', (e) => {
        if(!e.target.classList.contains('x-ico')) return;
        const xClickedElem = e.target.closest('.add-cart');
        const assignEl = xClickedElem.dataset.assign;
        holdTags.querySelectorAll('button').forEach(btn => (btn.dataset.name === assignEl) && resetClick(btn))
        xClickedElem.remove();
        sumTotal();
        resetTransAmt();
    })
}

const qtyMeasure = () => {
    document.addEventListener('click', (e) => {
        if(e.target.closest('.minus') || e.target.closest('.plus')){
            const holBtns = e.target.closest('.hol-qty-spans');
            let qtyNum = holBtns.querySelector('.qty');
            const price = e.target.closest('.add-cart').querySelector('.price');
            // console.log('price => ' + price.value);
            const btnAction = e.target.closest('button').dataset.symbol;
            if(btnAction === 'add'){
                holBtns.querySelector('.minus').removeAttribute('disabled');
                holBtns.querySelector('.minus').style.cursor = 'pointer';
                holBtns.querySelector('ion-icon').style.cursor = 'pointer';
                qtyNum.innerHTML = (+qtyNum.innerHTML) + 1;
            }
            else{
                if(+qtyNum.innerHTML === 0){
                    e.target.closest('button').setAttribute('disabled', 'true');
                    e.target.style.cursor = 'not-allowed';
                }
                else{
                    e.target.style.cursor = 'pointer';
                    e.target.closest('button').removeAttribute('disabled')
                    qtyNum.innerHTML = (+qtyNum.innerHTML) - 1;
                }
            }
            const sum = +qtyNum.innerHTML * +price.value;
            e.target.closest('.add-cart').querySelector('.total-val').innerHTML = sum;
            sumTotal();
            resetTransAmt();
        }
    })
}


const eachProductFunc = () => {
    const allCartProduct = document.querySelectorAll('.add-cart');
    allCartProduct.forEach(product => {
        const qty = product.querySelector('.qty');
        const price = product.querySelector('.price');
        const totalVal = product.querySelector('.total-val');
        price.addEventListener('keyup', function(e) {
            const sum = +qty.innerHTML * +price.value;
            totalVal.innerHTML = sum;
            sumTotal();
            resetTransAmt();
        })
    })
}

const totMo = document.querySelector('.tot-mval');
const totVal = document.querySelector('.big-tot');
const cashInp = document.querySelector('.cash-inp');
const sumTotal = () => {
    const allTotal = document.querySelectorAll('.total-val');
    let sumTotal = 0;
    allTotal.forEach(init => sumTotal += +init.innerHTML);
    totVal.innerHTML = sumTotal;
    cashInp.setAttribute('max',`${sumTotal-1}`)
}

document.querySelector('.cash-inp').addEventListener('keyup', function(){
    const newtotVal = +totVal.innerHTML;
    if(+totVal.innerHTML === 0) return;
    if(+this.value >= +newtotVal){
        totMo.innerHTML = '0';
        return;
    } 
    const cashAmt = +this.value;
    const momoAmt = +newtotVal - cashAmt;
    totMo.innerHTML = momoAmt;

    console.log('Total : ' + +newtotVal);
    console.log('Cash : ' + cashAmt);
    console.log('Momo : ' + momoAmt);

    let initTotal = +newtotVal;
    let initCash = cashAmt;
    let initMomo = momoAmt;
    document.querySelectorAll('.add-cart').forEach(item => {
        let selectTotal = item.querySelector('.total-val');
        let selectCash = item.querySelector('.cash-val');
        let selectMomo = item.querySelector('.momo-val');

        let itemTotal = selectTotal.innerHTML;
        let itemCash = 0;
        let itemMomo = 0;

        initTotal -= +itemTotal;
        if(initCash >= +itemTotal){
            initCash -= +itemTotal;
            itemCash = +itemTotal;
        }
        else{
            itemCash = initCash;
            itemMomo = +itemTotal - initCash;
            initCash -= itemCash;
        }
        selectCash.innerHTML = itemCash;
        selectMomo.innerHTML = itemMomo;
    })

})

const resetTransAmt = () => {
    cashInp.value = '';
    totMo.innerHTML = '0';
}

document.querySelector('#payment').addEventListener('change', function(){
    const payMeth = this.value;
    if(this.value === 'split'){
        document.querySelector('.rec-table').style.display = 'block';
        document.querySelectorAll('.cash-val').forEach(item=>item.innerHTML = '-');
        document.querySelectorAll('.momo-val').forEach(item=>item.innerHTML = '-');

    }
    else{
        document.querySelector('.rec-table').style.display = 'none';
        document.querySelectorAll('.add-cart').forEach(item => {
            if(payMeth === 'cash'){
                item.querySelector('.cash-val').innerHTML = '✅';
                item.querySelector('.momo-val').innerHTML = '';
            }
            else if(payMeth === 'momo'){
                item.querySelector('.momo-val').innerHTML = '✅';
                item.querySelector('.cash-val').innerHTML = '';
            }
            else{
                item.querySelector('.momo-val').innerHTML = '-';
                item.querySelector('.cash-val').innerHTML = '-';
            }
        })
        resetTransAmt();
    }
    
})


const submitCart = () => {
    document.querySelector('.cart-form').addEventListener('submit', function(e){
        e.preventDefault();
        const payMeth = document.querySelector('#payment').value;
        if(payMeth === ''){
            Swal.fire({
                icon: 'error',
                title: 'Select payment method 💵'
            })
            return;
        }
        console.log(payMeth);
        const data = {};
        document.querySelectorAll('.add-cart').forEach(cart => {
            const assignCart = cart.dataset.assign;
            const qty = cart.querySelector('.qty').innerHTML;
            data[assignCart] = [];
            data[assignCart].push(qty);
            const itemInps = cart.querySelectorAll('input');
            itemInps.forEach(inp => data[assignCart].push(inp.value));
            data[assignCart].push(payMeth);
        })
        const checkInps = Object.values(data);
        const everyArr = [];
        checkInps.forEach(item => {
            item.map((v, k) => {
                if(k === 0 || k === 1){
                    (v.length > 0 && +v > 0) ? everyArr.push(true) : everyArr.push(false)
                }
            })
        })
        const validFields = everyArr.every(e => e);
        if(validFields){
            Object.keys(data).forEach(k => data[k].push(new Date().toISOString()));
            console.log(data);
            // $.ajax({
            //     url: 'http://localhost:3000/checkout',
            //     method: 'POST',
            //     data: data,
            //     success: (res) => {
            //         console.log(res);
            //         if(res){
            //             Swal.fire({
            //                 icon: 'success',
            //                 title: 'Success ✅',
            //                 text: `Checkout Successful`,
            //             }).then(() => location.reload())
            //         }
            //     }
            // })
        }
        else{
            console.log('Empty fields');
            Swal.fire({
                icon: 'error',
                title: 'Empty Fields',
                text: `Quantity must be greater than 0 and Enter Price as well`,
            })
        }
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

const dateFunc = () => {
    const toDay = new Date();
    const options = {
        year: 'numeric',
        month : 'long', 
        day : 'numeric',
        weekday: 'long'
    }
    const locale = 'en-GB'
    const fullDate = new Intl.DateTimeFormat(locale, options).format(toDay);
    document.querySelector('.date').innerHTML = fullDate;
}
setInterval(() => {
    dateFunc();
    let hrs = new Date().getHours();
    let min = new Date().getMinutes();
    let sec = new Date().getSeconds();
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    min = min < 10 ? '0'+min : min;
    sec = sec < 10 ? '0'+sec : sec;
    document.querySelector('.hrs').innerHTML = hrs;
    document.querySelector('.min').innerHTML = min;
    document.querySelector('.sec').innerHTML = sec;
}, 1000)

checkout();
qtyMeasure();
closeItem();
submitCart();
