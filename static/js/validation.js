export const doValidation = (whichForm, url, theMethod) => {
    const holErr = [];
    const mainForm = document.querySelector(whichForm);
    const formData = new FormData(mainForm);
    const formKeyVal = [...formData];
    const mapData = new Map(formKeyVal);
    console.log(mapData);
    mapData.forEach((v,k)=>{
        if(k === 'version' || k === 'bh' || k === 'color') return;
        (v.length === 0) && holErr.push(k)
    });
    console.log("Error length: " + holErr.length);
    if(holErr.length === 0){
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
