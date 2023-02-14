export const doValidation = (formClass, whichForm, url, theMethod) => {
    const addInpFields = document.querySelector(formClass);
    const allInps = addInpFields.querySelectorAll('input');
    const holErr = [];
    allInps.forEach(el => {
        if(el.name !== 'version'){
            el.value.length === 0 && holErr.push(el)
        }
    });
    const nonEmptyFields = holErr.every(inp => inp.value.length > 0);
    if(nonEmptyFields){
        // no empty data 
        const addForm = document.querySelector(whichForm);
        const formData = new FormData(addForm);
        const data = {};
        for(const [key, value] of formData){
            data[key] = value.toLowerCase();
        }
        $.ajax({
            method : theMethod,
            url : url,
            data : data,
            success : (res) => {
                console.log(res);
                if(res === 'saved' || res === 'edited') alert(`Data ${res}`)
                location.reload();
            }
        })
    }
    else{
        alert('Fill all Fields, only VERSION field can be left blank')
    }
}
