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
