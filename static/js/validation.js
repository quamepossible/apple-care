export const doValidation = (whichForm, url, theMethod, reason) => {
  const holErr = [];
  let priceErr = 0;
  const mainForm = document.querySelector(whichForm);
  const formData = new FormData(mainForm);
  const formKeyVal = [...formData];
  const mapData = new Map(formKeyVal);
  console.log(mapData);
  let whatField = "";
  mapData.forEach((v, k) => {
    if (k === "version" || k === "bh" || k === "color") return;
    (k === "price" || k === "quantity") && +v < 1 && (priceErr += 1);
    whatField = k === "price" ? "Price" : "Quantity";
    v.length === 0 && holErr.push(k);
  });
  console.log("Error length: " + holErr.length);
  if (holErr.length === 0) {
    if (priceErr > 0) {
      Swal.fire({
        icon: "error",
        // title: 'Empty Fields',
        text: `${whatField} must be greater than 0`,
      });
      return;
    }
    // no empty data
    const data = {};
    for (const [key, value] of formData) data[key] = value.toLowerCase();
    console.log(data);
    const actRes = reason === 'ADD' ? 'Add' : 'Edit';
    Swal.fire({
      icon: "warning",
      text: `${actRes} Device?`,
      confirmButtonText: "Yes",
      showCancelButton: true,
      preConfirm: async () => {
        Swal.fire({
          icon: "info",
          text: `${actRes}ing device...`,
          showConfirmButton: false,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
        });
        const sellDevice = await fetch(url, {
          method: theMethod,
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        return sellDevice.text();
      },
      allowOutsideClick: false,
    }).then((res) => {
      console.log(res);
      let afterMathCheck;
      if (res.isConfirmed) {
        if (res.value === "added" || res.value === "edited") {
          afterMathCheck = Swal.fire({
            icon: "success",
            title: `${res.value}`,
            text: `Device ${res.value} successfully`,
          });
        } else {
          afterMathCheck = Swal.fire({
            icon: "error",
            title: "An error occured",
            text: "Retry operation",
          });
        }
        afterMathCheck.then(() => {
          document.querySelector(".product-backdrop").style.display = "none";
          Swal.fire({
            title: "Reloading page",
            text: "Please wait...",
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
            allowOutsideClick: false,
          });
          location.reload();
        });
      }
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Empty Fields",
      text: `Fields marked with '*' can't be left blank`,
    });
  }
};
