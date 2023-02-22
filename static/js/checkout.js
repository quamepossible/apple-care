'use strict';
import { doValidation } from "./validation.js";
$(document).ready( function () {
    $('#table_id').DataTable();
});

const formContainer = document.querySelector('.edit-cont');
const modalFunction = () => {
    const editSec = document.querySelector('.span-right');
    editSec.addEventListener('click', (e) => {
        formContainer.innerHTML = '';
        if(e.target.classList.contains('btn-edit')){
            const clicked = e.target.closest('.btn-edit');
            const itemID = clicked.dataset.val;
            console.log(itemID);
            try{
                const fetchData = async () => {
                    const getData = await fetch(`http://localhost:3000/data/${itemID}`);
                    if(!getData) throw new Error('Something went wrong')
                    const data = await getData.json();
                    // console.log(data);
                    const mapData = new Map(Object.entries(data));
                    mapData.forEach((v, k) => {
                        if(k === 'img') return;
                        const inps = `
                                    <div class="form-group col-md-6">
                                        <label for="">${k.toUpperCase()}</label>
                                        <input type="text" class="form-control" id="" name="${k}" value="${v}">
                                    </div>`;
                        formContainer.insertAdjacentHTML('beforeend', inps);
                    })
                }
                fetchData();
            }
            catch (err) {
                console.log(err.message);
            }
        }
        if(e.target.classList.contains('btn-out')){
            const clicked = e.target.closest('.btn-out');
            const itemId = clicked.dataset.val;
            console.log(itemId.trim());
            document.querySelector('#cident').value = itemId.trim();;
        }
    })
}

const editDataFunc = () => {
    document.querySelector('.edit-form').addEventListener('submit', function(e){
        e.preventDefault();
        doValidation('.edit-cont', '.edit-form', 'http://localhost:3000/edit', 'PATCH');
    })
}

const checkoutForm = () => {
    document.querySelector('.checkout-form').addEventListener('submit', function(e){
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(this));
        const mapData = new Map(Object.entries(formData));
        console.log(mapData);
        const err = [];
        mapData.forEach((v,k)=>(k !== 'cnote') && (v.length === 0) && err.push(k))
        if(err.length > 0){
            // there's error
            console.log('Empty fields on form');
        }
        else{
            // push data
            $.ajax({
                url: 'http://localhost:3000/sell',
                method: 'POST',
                data : formData,
                success: (data) => {
                    console.log(data);
                }
            })
        }
    })
}

editDataFunc();
checkoutForm();
modalFunction();