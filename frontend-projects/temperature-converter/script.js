document.addEventListener("DOMContentLoaded", function () {
  const elements = {
    value: document.querySelector("#quantity"),
    startUnit: document.querySelector("#start-unit"),
    endUnit: document.querySelector("#end-unit"),
    submitButton: document.querySelector("#convert"),
    result: document.querySelector("#result"),
    form: document.querySelector("#temperature-converter"),
  };

  elements.form.addEventListener("submit", function (ev) {
    ev.preventDefault();
  });
  elements.value.addEventListener("input", function () {
    checkForm();
  });
  elements.startUnit.addEventListener("change", function () {
    checkForm();
    hideOptions();
  });
  elements.endUnit.addEventListener("change", function () {
    checkForm();
  });
  elements.submitButton.addEventListener("click", function () {
    convertTemperature();
  });

  function convertTemperature() {
    const values = getValues();

    let endValue = 0;
    const units = `${values.startUnit}-${values.endUnit}`;

    switch (units) {
      case "K-F":
        endValue = kToF(values.initialValue);
        break;
      case "K-C":
        endValue = kToC(values.initialValue);
        break;
      case "F-C":
        endValue = fToC(values.initialValue);
        break;
      case "F-K":
        endValue = fToK(values.initialValue);
        break;
      case "C-K":
        endValue = cToK(values.initialValue);
        break;
      case "C-F":
        endValue = cToF(values.initialValue);
        break;
      case "C-C":
      case "F-F":
      case "K-K":
        endValue = values.initialValue;
        break;
    }
    
    let ok = !isNaN(endValue);

    values.endValue = endValue;
    values.ok = ok;

    getResult(values);
  }

  function checkForm() {
    const values = getValues();

    if (values.initialValue != null && values.startUnit != null && values.endUnit != null) {
      elements.submitButton.disabled = "";
    } else {
      elements.submitButton.disabled = "disabled";
    }
  }

  function getResult(result) {
    if (result.ok) {
      const html = `<div>${result.initialValue} ${result.startUnit} is ${result.endValue} ${result.endUnit}</div>`;
      elements.result.innerHTML = html;
    }
  }

  function getValues() {
    return {
      initialValue : parseFloat(elements.value.value) || null,
      startUnit : elements.startUnit.value || null,
      endUnit : elements.endUnit.value || null,
    }
  }

  function hideOptions() {
    const startUnit = elements.startUnit.value;
    const endOptions = document.querySelectorAll(".end-options");
    endOptions.forEach(option => {
      option.disabled = option.value === startUnit;
    });
  }

  // CALCULOS
  function kToF(k) { return Math.round(((k * (9 / 5)) - 459.67) * 100) / 100; }
  function kToC(k) { return Math.round((k - 273.15) * 100) / 100; }
  function fToC(f) { return Math.round(((f - 32) * (5/9)) * 100) / 100; }
  function fToK(f) { return Math.round(((f + 459.67) * 5/9) * 100) / 100; }
  function cToK(c) { return Math.round((c + 273.15) * 100) / 100; }
  function cToF(c) { return Math.round(((c * 9/5) + 32) * 100) / 100; }

});
