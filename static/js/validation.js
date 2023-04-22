export const doValidation = (whichForm, url, theMethod) => {
    const holErr = [];
    let priceErr = 0;
    const mainForm = document.querySelector(whichForm);
    const formData = new FormData(mainForm);
    const formKeyVal = [...formData];
    const mapData = new Map(formKeyVal);
    console.log(mapData);
    let whatField = '';
    mapData.forEach((v,k)=>{
        if(k === 'version' || k === 'bh' || k === 'color') return;
        ((k === 'price') || (k === 'quantity')) && (+v < 1) && (priceErr+=1);
        whatField = (k === 'price') ? 'Price':'Quantity';
        (v.length === 0) && holErr.push(k)
    });
    console.log("Error length: " + holErr.length);
    if(holErr.length === 0){
        if(priceErr > 0){
            Swal.fire({
                icon: 'error',
                // title: 'Empty Fields',
                text: `${whatField} must be greater than 0`,
            })
            return;
        }
        // no empty data 
        const data = {};
        for(const [key, value] of formData) data[key] = value.toLowerCase();
        console.log(data);
        $.ajax({
            method : theMethod,
            url : url,
            data : data,
            success : (res) => {
                console.log(res);
                if(res === 'saved' || res === 'edited') {
                    Swal.fire({
                        icon: 'success',
                        title: res,
                        text: `Device ${res} successfully`,
                    }).then(() => location.reload())
                }
                else if(res.toLowerCase() === 'empty data'){
                    Swal.fire({
                        icon: 'error',
                        title: 'Empty Fields',
                        text: `Fields marked with '*' can't be left blank`,
                    })
                }
            }
        })
    }
    else{
        Swal.fire({
            icon: 'error',
            title: 'Empty Fields',
            text: `Fields marked with '*' can't be left blank`,
        })
    }
}
