'use strict';

const searchParent = document.querySelector('.search-row');
// add keyup event, so that we'll do ajax request per data in input field
document.querySelector('.search-inp').addEventListener('keyup', async function(){
    searchParent.innerHTML = '';
    const searchBy = document.querySelector('.search-by');
    if(searchBy.value.length === 0) return;
    const searchWhat = searchBy.value;
    const queryString = this.value;
    const fetchRes = await fetch(`http://localhost:3000/fetch/${searchWhat}?query=${queryString}`);
    const resData = await fetchRes.json();
    console.log(resData);
    resData.forEach((data) => {
        console.log(data);
        const mapData = new Map(Object.entries(data));
        let row = '';
        mapData.forEach((v,k) => {
            if(k === '_id' || k === "__v" || k === 'model' || k === 'version' || k === 'check_date' || k === 'date_added' || k === 'check_time' || v === 'N/A') return;
            if(v.length === 0) v = '-';
            k = k.replace('_', ' ');
            if(k === 'method_ratio'){
                const {momo, cash} = data.method_ratio;
                if(momo === undefined){
                    v = `Cash : ${cash}`
                }
                if(cash === undefined){
                    v = `Momo : ${momo}`
                }
                v = `Cash : ${cash}, Momo : ${momo}`;
            }
            row += `<tr>
                <td><span class="res-title">${k.toUpperCase()}</span><span class="res-data">${v}</span></td>
            </tr>`
        });
        const {model, version=''} = data;
        const isPhone = (model.length <= 2) ? 'iPhone' : '';
        const fullDeviceName = `${isPhone} ${model} ${version}`;
        const eachData = `
        <div class="hol-search">
            <div class="search-1-of-3">
                <p class="item-head">
                    <span class="item-name">${fullDeviceName}</span>&nbsp;
                    <span class="item-status">Available</span>
                </p>
                <div class="search-content">
                    <table>
                    ${row}
                    </table>
                </div>
                <p class="item-foot">
                    <span class="date-tit">Date Added : </span>&nbsp;
                    <span class="date-content">21st March 2023</span>
                </p>
            </div>
        </div>
        `;
        searchParent.insertAdjacentHTML('beforeend', eachData);
    })
    

})
