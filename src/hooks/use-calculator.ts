"use client";

import { useState } from 'react';

export type HistoryItem = {
  expression: string;
  result: string;
};

export function useCalculator() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
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
  };

  const performCalculation: { [key: string]: (a: number, b: number) => number } = {
    '/': (first, second) => first / second,
    '*': (first, second) => first * second,
    '+': (first, second) => first + second,
    '-': (first, second) => first - second,
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation[operator](firstOperand, inputValue);
      const resultString = String(parseFloat(result.toPrecision(15)));
      setDisplayValue(resultString);
      setFirstOperand(result);

      const newHistoryItem: HistoryItem = {
        expression: `${firstOperand} ${operator} ${inputValue}`,
        result: resultString
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const handleEquals = () => {
    if (!operator || firstOperand === null) return;

    const secondOperand = parseFloat(displayValue);
    
    if (operator === '/' && secondOperand === 0) {
        setDisplayValue('Error');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
        return;
    }
    
    const result = performCalculation[operator](firstOperand, secondOperand);
    const resultString = String(parseFloat(result.toPrecision(15)));
    
    const newHistoryItem: HistoryItem = {
      expression: `${firstOperand} ${operator} ${secondOperand}`,
      result: resultString
    };
    setHistory(prev => [newHistoryItem, ...prev]);

    setDisplayValue(resultString);
    setFirstOperand(null); // Reset for new calculation
    setOperator(null);
    setWaitingForSecondOperand(false);
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
    clearHistory
  };
}
