const container = document.getElementById('container');
const mainInput = container.querySelector('#container #main-input');
const buttons = document.getElementsByClassName('button');
const mainScreen = document.querySelector('.screen #main-screen');
const previousScreen = document.querySelector('.screen #previous');
const darkButton = document.querySelector('#nav #color-mode #dark');
const lightButton = document.querySelector('#nav #color-mode #bright');

let colorMode = 'bright';
document.body.className = colorMode;
container.className = colorMode;
[...buttons].forEach((button) => {
  button.classList.add(colorMode);
});
const current = document.querySelector(`#color-mode #${colorMode} img`);
const to = document.querySelector(`#color-mode #${colorMode === 'bright' ? 'dark' : 'bright'} img`);
current.style.opacity = '100%';
to.style.opacity = '40%';
if (colorMode === 'bright') {
  current.style.filter = 'invert(0)';
  to.style.filter = 'invert(0)';
}
else {
  current.style.filter = 'invert(1)';
  to.style.filter = 'invert(1)';
}

darkButton.onclick = () => changeColorMode('dark');
lightButton.onclick = () => changeColorMode('bright');

let expression = '';
let previousExpression = '';
let previousOperation = [];
let currentNumber = '0';
let lastOperation = false;
let didEqual = false;

const add = (innerHTML) => operation(innerHTML, '+');
const subtract = (innerHTML) => operation(innerHTML, '-');
const multiply = (innerHTML) => operation(innerHTML, '*');
const divide = (innerHTML) => operation(innerHTML, '/');
const precentage = (innerHTML) => operation(innerHTML, '%');

[...buttons].forEach((button) => {
  const classList = button.classList;
  const innerHTML = button.innerHTML;
  const buttonFunction =
    classList.contains('reset') ? reset : 
    classList.contains('clear') ? clear :
    classList.contains('add') ? () => add(innerHTML) :
    classList.contains('subtract') ? () => subtract(innerHTML) :
    classList.contains('multiply') ? () => multiply(innerHTML) :
    classList.contains('divide') ? () => divide(innerHTML) :
    classList.contains('precentage') ? () => precentage(innerHTML) :
    classList.contains('number') ? () => number(innerHTML) : 
    classList.contains('decimal') ? () => number(innerHTML, true) : 
    classList.contains('equal') ? () => equal(innerHTML) : () => { };
  button.onmousedown = () => {
    classList.add('onMouseDown');
    buttonFunction();
  };
  button.onmouseup = () => button.classList.remove('onMouseDown');
  button.onmouseleave = button.onmouseup;
});

function reset() {
  expression = '';
  previousExpression = '';
  currentNumber = '0';
  lastOperation = false;
  didEqual = false;
  previousScreen.innerHTML = '';
  mainScreen.innerHTML = '0';
  previousOperation = [];
};
function clear() {
  currentNumber = '0'; 
  mainScreen.innerHTML = '0';
};

function number(innerHTML, isPoint) {
  if (didEqual) {
    didEqual = false;
    previousScreen.innerHTML = '';
    currentNumber = innerHTML;
  }
  else if (lastOperation) {
    currentNumber = innerHTML;
    lastOperation = false;
  }
  else currentNumber = currentNumber === '0' ? innerHTML : currentNumber.length >= 15 || (isPoint && currentNumber.includes('.')) ? currentNumber : currentNumber + innerHTML;
  mainScreen.innerHTML = currentNumber;
  previousOperation[1] = currentNumber;
};
function floor(innerHTML) {
  currentNumber = Math.floor(currentNumber);
  mainScreen.innerHTML = +currentNumber.toFixed(15);
}
function equal(innerHTML) {
  if (didEqual && previousExpression === '') return undefined;
  if (didEqual) {
    previousScreen.innerHTML = `${currentNumber} ${previousExpression.slice(-1)} ${previousOperation[1]} ${innerHTML}`;
    expression = eval(`${currentNumber}${previousOperation[0]}${previousOperation[1]}`);
    if (expression === +'Infinity') {
      const num = +previousOperation[1];
      reset();
      if (num === 0) { mainScreen.innerHTML = 'Cannot divide by zero'; }
      else { mainScreen.innerHTML = 'Number exceeded limit'}
    }
    else { mainScreen.innerHTML = +expression.toFixed(15); }
  }
  else {
    previousOperation[1] = currentNumber;
    previousScreen.innerHTML = `${previousExpression} ${currentNumber} ${innerHTML}`
    expression = eval(`${expression}${currentNumber}`);
    if (expression === +'Infinity') {
      const num = +previousOperation[1];
      reset();
      if (num === 0) { mainScreen.innerHTML = 'Cannot divide by zero'; }
      else { mainScreen.innerHTML = 'Number exceeded limit'}
    }
    else {
      lastOperation = false;
      didEqual = true;
      mainScreen.innerHTML = +expression.toFixed(12);
    }
  }
  currentNumber = expression;
  expression = '';
}

function operation(innerHTML, operator) {
  if (operator === '%') {
    if (didEqual) {
      currentNumber = currentNumber * currentNumber / 100;
      mainScreen.innerHTML = +currentNumber.toFixed(15);
      previousScreen.innerHTML = currentNumber;
    }
    else if (!lastOperation && expression === '') {
      mainScreen.innerHTML = '0';
      previousScreen.innerHTML = '0';
      currentNumber = '0';
    }
    else {
      currentNumber = expression.slice(0, -1) * currentNumber / 100;
      mainScreen.innerHTML = +currentNumber.toFixed(15);
    }
  }
  else {
    if (!lastOperation) {
      expression = eval(`${expression}${currentNumber}`);
      if (expression === +'Infinity') {
        const num = +previousOperation[1];
        reset();
        if (num === 0) { mainScreen.innerHTML = 'Cannot divide by zero'; }
        else { mainScreen.innerHTML = 'Number exceeded limit'}
      }
      else {
        previousExpression = `${expression} `;
        lastOperation = true;
        mainScreen.innerHTML = +expression.toFixed(15);
      }
    }
    else {
      expression = expression.slice(0, -1);
      previousExpression = previousExpression.slice(0, -1);
    }
    expression += operator;
    previousExpression += innerHTML;
    previousScreen.innerHTML = previousExpression;
    previousOperation[0] = operator;
    didEqual && ((didEqual = false));
  }
}

function backSpace() {
  if (lastOperation) return;
  if (didEqual) {
    let main = currentNumber;
    reset();
    currentNumber = main;    
  }
  else currentNumber = currentNumber.length === 1 ? '0' : currentNumber.slice(0,-1);
  mainScreen.innerHTML = currentNumber;
  didEqual && ((didEqual = false));
  previousOperation[1] = currentNumber;
}

document.onkeydown = (event) => {
  const key = event.key;
  switch(key) {
    case 'Escape': reset(); break;
    case 'Enter': equal('='); break;
    case 'Backspace': backSpace(); break;
    case 'c': clear(); break;
    case 'd': changeColorMode(colorMode === 'bright' ? 'dark' : 'bright'); break;
    case 'n': changeColorMode(colorMode === 'night' ? 'bright' : 'night'); break;
    case 'f': floor('_'); break;
    case '9': number('9'); break; 
    case '8': number('8'); break; 
    case '7': number('7'); break; 
    case '6': number('6'); break; 
    case '5': number('5'); break; 
    case '4': number('4'); break; 
    case '3': number('3'); break; 
    case '2': number('2'); break; 
    case '1': number('1'); break;
    case '0': number('0'); break; 
    case '.': number('.', true); break; 
    case ',': number('.', true); break; 
    case '+': add('+'); break; 
    case '-': subtract('-'); break; 
    case '/': divide('\u00f7'); break; 
    case '*': multiply('\u00d7'); break;
    case '%': precentage('%'); break;
  }
}

function changeColorMode(mode) {
  if (mode === colorMode) return;

  container.className = mode;
  document.body.className = mode;
  [...buttons].forEach((button) => {
    console.log(button.classList.toString());
    button.classList.remove(colorMode);
    button.classList.add(mode);
    console.log(button.classList.toString());
  });
  const bright = document.querySelector('#color-mode #bright img').style;
  const dark = document.querySelector('#color-mode #dark img').style;

  if (mode === 'bright') {
    bright.opacity = '1';
    dark.opacity = '0.4';
    bright.filter = 'invert(0)';
    dark.filter = 'invert(0)';
  }
  else if (mode === 'dark') {
    bright.opacity = '0.4';
    dark.opacity = '1';
    bright.filter = 'invert(1)';
    dark.filter = 'invert(1)';
  }
  colorMode = mode;
}
