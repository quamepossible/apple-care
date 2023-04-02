'use strict';

// add keyup event, so that we'll do ajax request per data in input field
document.querySelector('.search-inp').addEventListener('keyup', async function(){
    const searchBy = document.querySelector('.search-by');
    if(searchBy.value.length === 0) return;
    const searchWhat = searchBy.value;
    const queryString = this.value;
    const fetchRes = await fetch(`http://localhost:3000/fetch/${searchWhat}?query=${queryString}`);
    const resData = await fetchRes.json();
    console.log(resData);
})