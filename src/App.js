import './App.scss';
import CalcFunctions from './CalcFxns.js';
import { useState } from 'react';

const Calculator = (props) => {
  const charRefTable = {
    '+': 'add',
    '-': 'sub',
    '*': 'mul',
    '/': 'div',
    '%': 'mod',
    '=': 'eql',
  }
  const generateButton = (char, btnVisibleValue) => (
    <button
      onClick={btnVisibleValue}
      className='btn-visibleValueer'
      id={`btn-${charRefTable[char] ? charRefTable[char] : char}`}
      key={char}
      value={char}>
      {char}
    </button>);
  const generateButtonSet = (charArr, btnVisibleValue) => charArr.map((char) => generateButton(char, btnVisibleValue)); 
  const generateOutputDisplay = (num) => {
    let newString = '000000000' + num.toString();
    while (newString.length > 9) newString = newString.substring(1);
    return newString;
  }
  return (
    <div id='calc-wrapper'>
      <div id='output-wrapper'><p id='output'>{ generateOutputDisplay(props.display) }</p></div>
      { generateButtonSet('0123456789/*+%-='.split(''), props.btnVisibleValue) }
    </div>
  )
}

// Main function itself
function App() {
  const compose = (f) => (g) => (x) => f(g(x))

  // Set up each button to generate a new func containing its input and its function
  // Then combine those all together when the user requests it for an output

  const [visibleValue, setVisibleValue] = useState(0);
  let lastInput = '';
  let fullFunc;
  const charFuncTable = {
    '+': CalcFunctions.add,
    '-': CalcFunctions.subtract,
    '*': CalcFunctions.multiply,
    '/': CalcFunctions.divide,
    '%': CalcFunctions.modulo,
  };

  // Function that fires off whenever one of the buttons is clicked
  const buttonvisibleValue = (e) => {
    // Prevent bubbling up
    e.preventDefault();
    const value = e.target.value;

    // Clear visible if last input was an =
    if (lastInput === '=') setVisibleValue(fullFunc(0));

    // If this the input is a number
    if (e.target.value.match(/^[0-9]+$/)) {
      if (!visibleValue) setVisibleValue(value);
      else setVisibleValue(parseInt(`${visibleValue}${value}`));
    } 

    // Input is an action
    else {
      if (value === '=' && fullFunc) setVisibleValue(fullFunc(visibleValue)); 
      if (charFuncTable[value]) {
        fullFunc ? compose(charFuncTable[value](visibleValue))(fullFunc) : charFuncTable[value](visibleValue);
      }
    }

    lastInput = value;
  }
      
  return (
    <main className="bg">
      <Calculator display={visibleValue} btnVisibleValue={buttonvisibleValue}/>
    </main>
  );
}


export default App;
