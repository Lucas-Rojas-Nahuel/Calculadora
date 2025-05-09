function agregar(num1, num2) {
  return num1 + num2;
}

function sustraer(num1, num2) {
  return num1 - num2;
}

function multiplicar(num1, num2) {
  return num1 * num2;
}

function dividir(num1, num2) {
  return num2 !== 0 ? num1 / num2 : "Error";
}

function calcularPorcentaje(valor, base = null, operador = null) {
  const numero = parseFloat(valor);

  if (["*", "/"].includes(operador)) {
    return numero / 100;
  }

  if (base !== null) {
    return (numero * base) / 100;
  }

  return numero / 100;
}

function operate(operator, num1, num2) {
  num1 = parseFloat(num1);
  num2 = parseFloat(num2);

  switch (operator) {
    case "+":
      return agregar(num1, num2);
    case "-":
      return sustraer(num1, num2);
    case "*":
      return multiplicar(num1, num2);
    case "/":
      return dividir(num1, num2);
    default:
      return "";
  }
}

//selección de elemento del DOM
const display = document.querySelector(".display");
const num1Display = document.querySelector(".num1");
const num2Display = document.querySelector(".num2");
const operatorSign = document.querySelector(".operator-sign");
const buttons = document.querySelectorAll("button");
const equals = document.querySelector(".equals");
const clear = document.querySelector(".clear");

let contentsOfNum1Completed = false;
let completeSignOperationsContent = false;
let firstOperationCompleted = false;
let dividedByZero = false;

function toggleSign(displayElement) {
  if (displayElement.textContent.startsWith("-")) {
    displayElement.textContent = displayElement.textContent.slice(1);
  } else {
    displayElement.textContent = "-" + displayElement.textContent;
  }
}

function appendDecimal(displayElement) {
  if (!displayElement.textContent.includes(".")) {
    displayElement.textContent +=
      displayElement.textContent === "" ? "0." : ".";
  }
}

function handleButtonClick(button) {
  const valor = button.textContent;

  if (button.classList.contains("sign")) {
    if (dividedByZero) return;
    toggleSign(
      contentsOfNum1Completed && completeSignOperationsContent
        ? num2Display
        : num1Display
    );
    return;
  }

  if (button.classList.contains("percent")) {
    let target;
    if (firstOperationCompleted) {
      target = num1Display;
    } else {
      target = contentsOfNum1Completed ? num2Display : num1Display;
    }

    if (target.textContent !== "") {
      (target.textContent = calcularPorcentaje(
        target.textContent,
        contentsOfNum1Completed ? parseFloat(num1Display.textContent) : null
      )),
        operatorSign.textContent;
    }
    return;
  }

  if (button.classList.contains("decimal")) {
    if (contentsOfNum1Completed && completeSignOperationsContent) {
      appendDecimal(num2Display);
    } else {
      appendDecimal(num1Display);
    }
    return;
  }

  if (button.classList.contains("clear")) {
    clearCalculator();
    return;
  }

  if (button.classList.contains("operator")) {
    if (num1Display.textContent === "" || dividedByZero) return;
    if (num2Display.textContent === "") {
      operatorSign.textContent = valor;
      if (firstOperationCompleted) {
        firstOperationCompleted = false;
      }
      contentsOfNum1Completed = true;
    } else {
      equals.click();
      operatorSign.textContent = valor;
      firstOperationCompleted = false;
    }
    return;
  } else {
    if (contentsOfNum1Completed) {
      completeSignOperationsContent = true;
    } else {
      completeSignOperationsContent = false;
    }
  }

  if (button.classList.contains("operand")) {
    if (firstOperationCompleted) {
      contentsOfNum1Completed = false;
      completeSignOperationsContent = false;
      dividedByZero = false;
      num1Display.textContent = "";
      firstOperationCompleted = false;
    }

    if (contentsOfNum1Completed) {
      completeSignOperationsContent = true;
      if (num2Display.textContent.length === 9) return;
      num2Display.textContent += valor;
    } else {
      if (num1Display.textContent.length === 9) return;
      num1Display.textContent += valor;
    }
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => handleButtonClick(button));
});

equals.addEventListener("click", () => {
  //si divide por 0
  if (
    num1Display.textContent === "0" &&
    num2Display.textContent === "0" &&
    operatorSign.textContent === "/"
  ) {
    operatorSign.textContent = "";
    num2Display.textContent = "";
    firstOperationCompleted = true;
    dividedByZero = true;
    return (num1Display.textContent = "Malo >:v");
  }

  //si no hay datos, no hacemos nada
  if (num1Display.textContent === "" || num2Display.textContent === "") {
    return;
  }

  //realizar operación
  const result = operate(
    operatorSign.textContent,
    num1Display.textContent,
    num2Display.textContent
  );

  num1Display.textContent = result;
  num2Display.textContent = "";
  operatorSign.textContent = "";

  completeSignOperationsContent = false;
  firstOperationCompleted = true;
});

//funcion para limpiar
function clearCalculator() {
  num1Display.textContent = "";
  num2Display.textContent = "";
  operatorSign.textContent = "";
  contentsOfNum1Completed = false;
  completeSignOperationsContent = false;
  firstOperationCompleted = false;
  dividedByZero = false;
}
