const validateItemLetter = (value) => {
  if (!value) {
    return [false, "Please enter item letter."];
  }

  if (!(value.length === 1 && value.match(/[a-z]/i))) {
    return [false, "Please enter only one letter for item letter."];
  }

  const itemLetter = $("#act-table tbody tr:last-child > td:first-child");
  let lastLetter = "Project empty.";
  if (itemLetter.length > 0) {
    lastLetter = $("#act-table tbody tr:last-child > td:first-child")[0]
      .textContent;
  }

  if (lastLetter === "Project empty." && value.trim().toUpperCase() !== "A") {
    return [false, `Please enter the initial letter for item letter.`];
  }

  return [true, ""];
};

const validatePredecessor = (value) => {
  if (value && !value.match(/[a-z]/i)) {
    return [
      false,
      "Please enter only an alphabet letter for immediate predecessor.",
    ];
  }
  if ($("#impre").val().indexOf(" ") >= 0) {
    return [false, "Please remove spaces in Immediate predecessor."];
  }
  if (value.trim() === $("#itemL").val().trim()) {
    return [
      false,
      "Immediate predecessor must not be the same as item letter.",
    ];
  }

  return [true, ""];
};

const isDecimal = (value, name) => {
  if (!value) {
    return [false, "Please enter " + name + "."];
  }

  const isDecimal = value.match(/^-?\d*\.?\d+$/);
  if (isDecimal === null) {
    return [false, `Invalid input for ${name}.`];
  }

  return [true, ""];
};

export const projectValidation = (inputId, inputValue) => {
  inputValue = inputValue.trim();

  if (inputId === "itemL") {
    return validateItemLetter(inputValue);
  }

  if (inputId === "impre") {
    return validatePredecessor(inputValue);
  }

  if (inputId === "timeA") {
    return isDecimal(inputValue, "Time Estimates (A)");
  }

  if (inputId === "timeM") {
    return isDecimal(inputValue, "Time Estimates (M)");
  }

  if (inputId === "timeB") {
    return isDecimal(inputValue, "Time Estimates (B)");
  }

  return true;
};
