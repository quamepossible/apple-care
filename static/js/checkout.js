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
        if(!e.target.classList.contains('btn-edit')) return;
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
    })
}

const editDataFunc = () => {
    document.querySelector('.edit-form').addEventListener('submit', function(e){
        e.preventDefault();
        doValidation('.edit-cont', '.edit-form', 'http://localhost:3000/edit', 'PATCH');
    })
}

editDataFunc();
modalFunction();