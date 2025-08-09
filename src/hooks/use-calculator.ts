"use client";

import { useState } from 'react';

export type HistoryItem = {
  expression: string;
  result: string;
};

export function useCalculator() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [fullExpression, setFullExpression] = useState<string>('');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      const newDisplayValue = displayValue === '0' ? digit : displayValue + digit;
      setDisplayValue(newDisplayValue);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearInput = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setFullExpression('');
  };

  const backspace = () => {
    if (waitingForSecondOperand) return;
    const newDisplayValue = displayValue.slice(0, -1) || '0';
    setDisplayValue(newDisplayValue);
  };
  
  const handlePercent = () => {
    const currentValue = parseFloat(displayValue);
    if (isNaN(currentValue)) {
      return;
    }

    let result;
    if (firstOperand !== null && operator) {
      result = (currentValue / 100) * firstOperand;
    } else {
      result = currentValue / 100;
    }
    
    const resultString = String(parseFloat(result.toPrecision(15)));
    setDisplayValue(resultString);
  };

  const toggleSign = () => {
    if (displayValue !== '0') {
      setDisplayValue(
        displayValue.startsWith('-')
          ? displayValue.substring(1)
          : `-${displayValue}`
      );
    }
  };

  const performCalculation: { [key: string]: (a: number, b: number) => number } = {
    '/': (first, second) => first / second,
    '*': (first, second) => first * second,
    '+': (first, second) => first + second,
    '-': (first, second) => first - second,
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);
    const operatorSymbol = nextOperator === '*' ? '×' : nextOperator === '/' ? '÷' : nextOperator;

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      setFullExpression(prev => prev.slice(0, -2) + ` ${operatorSymbol} `);
      return;
    }
    
    setFullExpression(prev => `${prev === '' ? (firstOperand !== null ? firstOperand : '') : `${prev} `}${displayValue} ${operatorSymbol} `);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation[operator](firstOperand, inputValue);
      const resultString = String(parseFloat(result.toPrecision(15)));
      setDisplayValue(resultString);
      setFirstOperand(result);

      const expressionText = `${fullExpression}${displayValue}`;
      const newHistoryItem: HistoryItem = {
        expression: expressionText,
        result: resultString
      };
      setHistory(prev => [newHistoryItem, ...prev]);
      setFullExpression(`${resultString} ${operatorSymbol} `);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const handleEquals = () => {
    if (!operator || firstOperand === null) return;

    const secondOperand = parseFloat(displayValue);
    const operatorSymbol = operator === '*' ? '×' : operator === '/' ? '÷' : operator;
    
    if (operator === '/' && secondOperand === 0) {
        setDisplayValue('Error');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
        setFullExpression('');
        return;
    }
    
    const result = performCalculation[operator](firstOperand, secondOperand);
    const resultString = String(parseFloat(result.toPrecision(15)));
    
    const expressionText = `${fullExpression}${displayValue}`;
    const newHistoryItem: HistoryItem = {
      expression: expressionText,
      result: resultString
    };
    setHistory(prev => [newHistoryItem, ...prev]);

    setDisplayValue(resultString);
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setFullExpression('');
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    displayValue,
    fullExpression,
    history,
    inputDigit,
    inputDecimal,
    clearInput,
    handleOperator,
    handleEquals,
    clearHistory,
    handlePercent,
    backspace,
    toggleSign,
  };
}
