export const doValidation = (whichForm, url, theMethod) => {
    const holErr = [];
    const mainForm = document.querySelector(whichForm);
    const formData = new FormData(mainForm);
    const mapData = new Map(Object.entries(formData));

    mapData.forEach((v,k)=>(k !== 'version') && (v.length === 0) && holErr.push(k));
    if(holErr.length === 0){
        // no empty data 
        const data = {};
        for(const [key, value] of formData) data[key] = value.toLowerCase();
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
        alert('Fill all Fields, only VERSION field can be left blank')
    }
}
