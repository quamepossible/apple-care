'use strict';

const searchDateFunc = (theDate) => {
    const toDay = theDate
    const options = {
        year: 'numeric',
        month : 'long', 
        day : 'numeric',
        weekday: 'long'
    }
    const locale = 'en-GB'
    const fullDate = new Intl.DateTimeFormat(locale, options).format(toDay);
    return fullDate;
}

document.querySelector('.search-form').addEventListener('submit', (e)=>e.preventDefault())

const searchParent = document.querySelector('.search-row');
// add keyup event, so that we'll do ajax request per data in input field
document.querySelector('.search-inp').addEventListener('keyup', async function(e){
    if(e.code === '') return;
    if(this.value.length === 0){
        $('.no-res').css('display', 'none');
        searchParent.innerHTML = '';
        return;
    }
    searchParent.innerHTML = '';
    const searchBy = document.querySelector('.search-by');
    if(searchBy.value.length === 0) return;
    const searchWhat = searchBy.value;
    const queryString = this.value.toLowerCase();
    const fetchRes = await fetch(`http://localhost:3000/fetch/${searchWhat}?query=${queryString}`);
    const resData = await fetchRes.json();
    console.log(resData.length);
    if(resData.length === 0)$('.no-res').css('display', 'block');
    else $('.no-res').css('display', 'none');

    resData.forEach((data) => {
        console.log(data);
        const mapData = new Map(Object.entries(data));
        let row = '';
        mapData.forEach((v,k) => {
            if(k === '_id' || k === "__v" || k === 'model' || k === 'version' || k === 'check_date' || k === 'date_added' || k === 'check_time' || k === 'time_added' || v === 'N/A') return;
            if(v.length === 0) v = '-';
            if(k === 'method_ratio'){
                k = 'payment style'
                const {momo, cash} = data.method_ratio;
                console.log('Momo ' + typeof momo);
                console.log('Cash ' + typeof cash);
                if(momo === undefined){
                    v = `<b>Cash :</b> ${cash}`
                }
                if(cash === undefined){
                    v = `<b>Momo :</b> ${momo}`
                }
                if(momo !== undefined && cash !== undefined){
                    v = `<b>Cash :</b> ${cash}, <b>Momo :</b> ${momo}`;
                }
            }
            k = k.replace('_', ' ');
            row += `<tr>
                <td><span class="res-title">${k.toUpperCase()}</span><span class="res-data">${(''+v).toUpperCase()}</span></td>
            </tr>`
        });
        const {model, version=''} = data;
        const isPhone = (model.length <= 2) ? 'iPhone' : '';
        const fullDeviceName = `${isPhone} ${model} ${version}`;
        let dateArr, timeStatus, availability, bg, itemHead;
        if(data?.check_date && data?.check_time){
            dateArr = [data.check_date, data.check_time].join('T');
            timeStatus = 'Date Sold';
            availability = 'Sold';
            itemHead = bg = 'red';

        }
        else if(data?.date_added){
            dateArr = data.date_added;
            timeStatus = 'Date Added';
            availability = 'Available';
            bg = 'green';
            itemHead = 'rgb(0, 116, 232)';
        }
        const eachData = `
        <div class="hol-search">
            <div class="search-1-of-3">
                <p class="item-head"style="background-color:${itemHead}">
                    <span class="item-name">${fullDeviceName}</span>&nbsp;
                    <span class="item-status" style="background-color:${bg}">${availability}</span>
                </p>
                <div class="search-content">
                    <table>
                    ${row}
                    </table>
                </div>
                <p class="item-foot">
                    <span class="date-tit">${timeStatus} </span> :&nbsp;
                    <span class="date-content">${searchDateFunc(new Date(dateArr))}</span>
                </p>
            </div>
        </div>
        `;
        searchParent.insertAdjacentHTML('beforeend', eachData);
    })
})


document.querySelector('.search-by').addEventListener('change', function(){
    const inpForm = document.querySelector('.search-inp');
    if(this.value === 'date'){
        inpForm.setAttribute('type', 'date');
        searchParent.innerHTML = '';
    }
    else{
        inpForm.setAttribute('type', 'text');
        inpForm.value = '';
        searchParent.innerHTML = '';
    }
})