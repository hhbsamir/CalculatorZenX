"use client";

import { useState } from 'react';

export type HistoryItem = {
  expression: string;
  result: string;
};

// A very simple and limited expression evaluator.
// For a real-world scenario, a more robust library would be necessary.
const evaluateExpression = (expression: string): number => {
    // Replace user-friendly operators with JS-friendly ones
    let evalFriendlyExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/\^/g, '**');

    // Handle sqrt() and other functions if needed, although current logic applies them immediately.
    // This basic eval does not respect order of operations beyond what Function constructor does.
    try {
        // This is a security risk in a real app, but for this contained example it's a simple way to evaluate.
        return new Function('return ' + evalFriendlyExpression)();
    } catch (error) {
        console.error("Evaluation error:", error);
        return NaN; // Indicate an error
    }
};

const factorial = (n: number): number => {
    if (n < 0) return NaN; // Factorial is not defined for negative numbers
    if (n === 0) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}


export function useScientificCalculator() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isResult, setIsResult] = useState(false);


  const inputDigit = (digit: string) => {
    if (isResult) {
        setDisplayValue(digit);
        setIsResult(false);
    } else {
        setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (isResult) {
        setDisplayValue('0.');
        setIsResult(false);
        return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearInput = () => {
    setDisplayValue('0');
    setIsResult(false);
  };
  
  const handleOperator = (operator: string) => {
    setIsResult(false);
    if (operator === 'sqrt') {
      handleFunction('sqrt');
      return;
    }
    setDisplayValue(displayValue + ` ${operator} `);
  }

  const handleFunction = (func: string) => {
    const currentValue = parseFloat(displayValue);
    let result: number | string = 0;
    let expression = `${func}(${displayValue})`;

    switch(func) {
        case 'sin':
            result = Math.sin(currentValue * Math.PI / 180); // Assuming degree input
            break;
        case 'cos':
            result = Math.cos(currentValue * Math.PI / 180); // Assuming degree input
            break;
        case 'tan':
            result = Math.tan(currentValue * Math.PI / 180); // Assuming degree input
            break;
        case 'log':
            result = Math.log10(currentValue);
            break;
        case 'ln':
            result = Math.log(currentValue);
            break;
        case '!':
            result = factorial(currentValue);
            expression = `${displayValue}!`;
            break;
        case 'sqrt':
            result = Math.sqrt(currentValue);
            expression = `√(${displayValue})`;
            break;
        case 'pi':
            result = Math.PI;
            expression = 'π';
            break;
        case 'e':
            result = Math.E;
            expression = 'e';
            break;
        default:
            return;
    }

    const resultString = String(parseFloat(result.toPrecision(15)));
    setHistory(prev => [{ expression, result: resultString }, ...prev]);
    setDisplayValue(resultString);
    setIsResult(true);
  }

  const handleEquals = () => {
    try {
        // A simple eval is used here. For a real app, a proper math expression parser is needed.
        const expression = displayValue.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\^/g, '**');
        const result = eval(expression);
        const resultString = String(parseFloat(result.toPrecision(15)));

        const newHistoryItem: HistoryItem = {
          expression: displayValue,
          result: resultString
        };
        setHistory(prev => [newHistoryItem, ...prev]);

        setDisplayValue(resultString);
        setIsResult(true);
    } catch (error) {
        setDisplayValue('Error');
        setIsResult(true);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    displayValue,
    history,
    inputDigit,
    inputDecimal,
    clearInput,
    handleOperator,
    handleEquals,
    handleFunction,
    clearHistory
  };
}
