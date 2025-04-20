document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#birth-date", {
    dateFormat: "d/m/Y",
    maxDate: "today",
  });

  const DateTime = luxon.DateTime;
  const resultSpan = document.getElementById("result");
  const resultText = document.getElementById("result-text");
  const errorText = document.getElementById("error-text");
  const form = document.getElementById("age-calculator");

  form.addEventListener("submit", function (ev) {
    calculateAge(ev);
  });

  function calculateAge(ev) {
    ev.preventDefault();
    resetResult();
    checkInput(ev.target[0].value);
    const birthDateFormatted = DateTime.fromFormat(
      ev.target[0].value,
      "dd/MM/yyyy"
    );
    const todayDate = DateTime.now();
    const difference = todayDate.diff(birthDateFormatted, [
      "years",
      "months",
      "days",
      "hours",
    ]);

    let resultString = "";
    setResultString(resultString, difference.values);
  }

  function resetResult() {
    resultText.classList.add("d-none");
    errorText.classList.add("d-none");
  }
  function checkInput(input) {
    if (!input) {
      errorText.classList.remove("d-none");
      return;
    }
  }
  function setResultString(resultString, values) {
    if (values) {
      values.years != 0 && values.years
        ? (resultString += values.years + " years ")
        : "";
      values.months != 0 && values.months
        ? (resultString += values.months + " months ")
        : "";
      values.days != 0 && values.days
        ? (resultString += values.days + " days ")
        : "";

      resultText.classList.remove("d-none");
      resultSpan.innerHTML = resultString;
    } else {
      errorText.classList.remove("d-none");
    }
  }
});
