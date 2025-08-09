"use client";
import { useState, useEffect, useRef } from 'react';
import { create, all, type MathJsStatic } from 'mathjs';

export type HistoryItem = {
  expression: string;
  result: string;
};

type CalculatorState = {
  expression: string;
  display: string;
  history: HistoryItem[];
  isResult: boolean;
  angleMode: 'deg' | 'rad';
  memory: number;
};

const initialState: CalculatorState = {
  expression: '',
  display: '0',
  history: [],
  isResult: false,
  angleMode: 'deg',
  memory: 0,
};

export function useScientificCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const mathRef = useRef<MathJsStatic | null>(null);

  const initializeMathJs = (angleMode: 'deg' | 'rad') => {
    const newMath = create(all, {
      number: 'BigNumber',
      precision: 64,
    });

    if (angleMode === 'deg') {
      const sin = newMath.sin;
      newMath.sin = (x) => sin(newMath.multiply(x, newMath.pi) / 180);
      const cos = newMath.cos;
      newMath.cos = (x) => cos(newMath.multiply(x, newMath.pi) / 180);
      const tan = newMath.tan;
      newMath.tan = (x) => tan(newMath.multiply(x, newMath.pi) / 180);
      const asin = newMath.asin;
      newMath.asin = (x) => newMath.multiply(asin(x), 180) / newMath.pi;
      const acos = newMath.acos;
      newMath.acos = (x) => newMath.multiply(acos(x), 180) / newMath.pi;
      const atan = newMath.atan;
      newMath.atan = (x) => newMath.multiply(atan(x), 180) / newMath.pi;
    }
    mathRef.current = newMath;
  };
  
  const formatResult = (result: any) => {
    const math = mathRef.current;
    if (!math) return "Error";
    try {
        if (math.isComplex(result)) {
            return result.toString();
        }
        return math.format(result, { notation: 'auto', precision: 15 });
    } catch {
        return "Error";
    }
  };

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('scientificCalculatorState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setState(parsedState);
        initializeMathJs(parsedState.angleMode || 'deg');
      } else {
        initializeMathJs('deg');
      }
    } catch (error) {
      initializeMathJs('deg');
      setState(initialState);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('scientificCalculatorState', JSON.stringify(state));
    } catch (error) {
      console.error("Could not save state to localStorage", error);
    }
  }, [state]);

  const setAngleMode = (mode: 'deg' | 'rad') => {
    initializeMathJs(mode);
    setState(prevState => ({ ...prevState, angleMode: mode }));
  };

  const updateState = (newState: Partial<CalculatorState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  const handleInput = (input: string, isOperator = false) => {
    if (state.isResult) {
        if (isOperator) {
            updateState({ expression: state.display + input, display: state.display + input, isResult: false });
        } else {
            updateState({ expression: input, display: input, isResult: false });
        }
    } else {
        const newExpression = state.expression === '0' && !isOperator ? input : state.expression + input;
        const newDisplay = state.display === '0' && !isOperator ? input : state.display + input;
        updateState({ expression: newExpression, display: newDisplay });
    }
  };

  const inputDigit = (digit: string) => handleInput(digit);
  const inputOperator = (operator: string) => handleInput(operator, true);

  const inputFunction = (func: string) => {
     if (state.isResult) {
      updateState({ expression: func, display: func, isResult: false });
    } else {
      updateState({
        expression: state.expression + func,
        display: state.display + func
      });
    }
  };

  const calculate = () => {
    const math = mathRef.current;
    if (state.expression === '' || !math) return;
    try {
      let evalExpression = state.expression.replace(/π/g, 'pi').replace(/√/g, 'sqrt');
      const result = math.evaluate(evalExpression);
      const formattedResult = formatResult(result);
      
      if (formattedResult === "Error") throw new Error("Invalid calculation");

      const newHistoryItem: HistoryItem = {
        expression: state.expression,
        result: formattedResult,
      };

      updateState({
        display: formattedResult,
        history: [newHistoryItem, ...state.history.slice(0, 49)],
        isResult: true,
      });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Invalid Expression";
        updateState({
            display: 'Error',
            expression: errorMessage,
            isResult: true,
        });
    }
  };

  const clear = () => {
    updateState({ expression: '', display: '0', isResult: false });
  };

  const backspace = () => {
    if (state.isResult) {
      clear();
      return;
    }
    updateState({
      expression: state.expression.slice(0, -1),
      display: state.display.slice(0, -1) || '0',
    });
  };
  
  const toggleSign = () => {
     if (state.display !== '0') {
        if (state.isResult) {
            const negatedResult = (parseFloat(state.display) * -1).toString();
            updateState({
                display: negatedResult,
                expression: negatedResult
            });
        } else {
            if(state.display.startsWith('-')) {
                updateState({
                    display: state.display.substring(1),
                    expression: state.expression.substring(1),
                });
            } else {
                 updateState({
                    display: `-${state.display}`,
                    expression: `-${state.expression}`,
                });
            }
        }
    }
  };

  const inputPercent = () => {
    if (state.isResult) {
      const percentValue = parseFloat(state.display) / 100;
      updateState({
        display: percentValue.toString(),
        expression: percentValue.toString(),
        isResult: true,
      });
    } else {
        handleInput('/100');
    }
  };

  const memoryClear = () => updateState({ memory: 0 });
  const memoryRecall = () => {
    handleInput(state.memory.toString());
  };
  const memoryAdd = () => {
    const currentDisplayValue = parseFloat(state.display);
    if (!isNaN(currentDisplayValue)) {
      updateState(prevState => ({ memory: prevState.memory + currentDisplayValue }));
    }
  };
  const memorySubtract = () => {
    const currentDisplayValue = parseFloat(state.display);
    if (!isNaN(currentDisplayValue)) {
      updateState(prevState => ({ memory: prevState.memory - currentDisplayValue }));
    }
  };

  const clearHistory = () => {
    updateState({ history: [] });
  }

  return {
    state,
    inputDigit,
    inputOperator,
    inputFunction,
    calculate,
    clear,
    backspace,
    toggleSign,
    inputPercent,
    memoryClear,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    setAngleMode,
    clearHistory
  };
}
