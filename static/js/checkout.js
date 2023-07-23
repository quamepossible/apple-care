"use strict";
import { doValidation } from "./validation.js";
$(document).ready(function () {
  $("#table_id").DataTable();
});

const formContainer = document.querySelector(".edit-cont");
const modalFunction = () => {
  const editSec = document.querySelector(".span-right");
  editSec.addEventListener("click", (e) => {
    formContainer.innerHTML = "";
    if (e.target.classList.contains("btn-edit")) {
      const clicked = e.target.closest(".btn-edit");
      const itemID = clicked.dataset.val;
      let mainID;
      console.log(itemID);
      try {
        const fetchData = async () => {
          const getData = await fetch(`/data/${itemID}`);
          if (!getData) throw new Error("Something went wrong");
          const data = await getData.json();
          const mapData = new Map(Object.entries(data));
          mapData.forEach((v, k) => {
            if (k === "_id") mainID = v;
            if (
              k === "date_added" ||
              k === "time_added" ||
              k === "_id" ||
              k === "__v"
            )
              return;
            const vers = k.toUpperCase();
            const spanVer =
              vers === "VERSION" || vers === "BH" || vers === "COLOR"
                ? ""
                : "<span>*</span>";
            const inpType = vers === "PRICE" ? "number" : "text";
            const min = vers === "PRICE" ? `min='1'` : "";
            const inps = `
                          <div class="form-group col-md-6">
                              <label for="">${k.toUpperCase()} ${spanVer}</label>
                              <input type="${inpType}" ${min}  class="form-control" id="" name="${k}" value="${v}">
                          </div>`;
            formContainer.insertAdjacentHTML("beforeend", inps);
          });
          const holdID = `<input type="text" style="display:none" value=${mainID} name="id" class="editID">`;
          formContainer.insertAdjacentHTML("beforeend", holdID);
        };
        fetchData();
      } catch (err) {
        console.log(err.message);
      }
    }
    if (e.target.classList.contains("btn-out")) {
      const clicked = e.target.closest(".btn-out");
      const itemId = clicked.dataset.val;
      console.log(itemId.trim());
      document.querySelector("#cident").value = itemId.trim();
      // document.querySelector('#cprice').value = itemId.trim();;
    }
  });
};

const editDataFunc = () => {
  document.querySelector(".edit-form").addEventListener("submit", function (e) {
    e.preventDefault();
    doValidation(".edit-form", "/edit", "PATCH", "EDIT");
  });
};

document.querySelectorAll(".btn-out").forEach((outBtn) => {
  outBtn.addEventListener("click", () => {
    document
      .querySelector(".checkout-form")
      .querySelectorAll("input")
      .forEach((input) => (input.value = ""));
  });
});

const checkoutForm = () => {
  const paymentType = document.querySelector(".payment");
  paymentType.addEventListener("change", function () {
    const splitMode = document.querySelectorAll(".split-pay");
    if (this.value === "split") {
      splitMode.forEach((split) => (split.style.display = "block"));
    } else {
      splitMode.forEach((split) => (split.style.display = "none"));
    }
  });

  const cashSec = document.querySelector("#cash");
  const momoSec = document.querySelector("#momo");
  cashSec.addEventListener("keyup", function () {
    const getIdInfo = document.querySelector("#cident");
    const toBePaid = getIdInfo.value.split("-")[1];
    this.setAttribute("max", +toBePaid - 1);

    if (this.value > +toBePaid - 1) {
      momoSec.value = "-";
      return;
    }
    const momoPay = +toBePaid - +this.value;
    momoSec.value = momoPay;
  });

  document
    .querySelector(".checkout-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const initForm = new FormData(this);
      const formData = Object.fromEntries(new FormData(this));
      const getIdInfo = document.querySelector("#cident");
      const toBePaid = getIdInfo.value.split("-")[1];
      formData.methodRatio = {};
      const payType = paymentType.value;
      if (payType === "split") {
        formData.methodRatio = {
          cash: cashSec.value,
          momo: momoSec.value,
        };
      } else if (payType === "cash" || payType === "momo") {
        formData.methodRatio[payType] = toBePaid;
      }
      const mapData = new Map(Object.entries(formData));
      // console.log(mapData);
      const err = [];
      payType === "split" &&
        (cashSec.value.length === 0 || momoSec.value.length === 0) &&
        err.push("error");
      mapData.forEach((v, k) => k !== "cnote" && v.length === 0 && err.push(k));
      if (err.length > 0) {
        // there's error
        Swal.fire({
          icon: "error",
          title: "Empty Fields",
          text: `Fields marked with '*' can't be left blank`,
        });
      } else {
        Swal.fire({
          icon: "warning",
          text: "Proceed with Checkout?",
          confirmButtonText: "Yes",
          showCancelButton: true,
          //   showLoaderOnConfirm: true,
          preConfirm: async () => {
            Swal.fire({
              icon: "info",
              text: "checking out...",
              showConfirmButton: false,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
              },
              allowOutsideClick: false,
            });
            const sellDevice = await fetch("/sell", {
              method: "POST",
              body: JSON.stringify(formData),
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
            if (res.value === "sold") {
              afterMathCheck = Swal.fire({
                icon: "success",
                title: "Sold",
                text: `Device sold successfully`,
              });
            } else {
              afterMathCheck = Swal.fire({
                icon: "error",
                title: "An error occured",
                text: "Product still in system",
              });
            }
            afterMathCheck.then(() => {
              document.querySelector(".check-backdrop").style.display = "none";
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
      }
    });
};

editDataFunc();
checkoutForm();
modalFunction();
