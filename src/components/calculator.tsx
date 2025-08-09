
"use client";

import { CornerUpLeft, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { useCalculator, type HistoryItem } from '@/hooks/use-calculator';
import { ScrollArea } from './ui/scroll-area';

export function Calculator() {
  const {
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
  } = useCalculator();

  const renderHistory = () => (
    history.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <History className="w-16 h-16 mb-4" />
        <p className="text-lg">No history yet.</p>
        <p>Your past calculations will appear here.</p>
      </div>
    ) : (
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-grow">
          <div className="space-y-4 pr-6">
            {history.map((item: HistoryItem, index: number) => (
              <div key={index} className="text-right">
                <p className="text-sm text-muted-foreground">{item.expression} =</p>
                <p className="text-2xl font-bold">{item.result}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <SheetFooter className="mt-4 pt-4 border-t">
            <Button variant="outline" onClick={clearHistory}>
                Clear History
            </Button>
            <SheetClose asChild>
                <Button>Close</Button>
            </SheetClose>
        </SheetFooter>
      </div>
    )
  );
  
  const buttonClass = "text-xl sm:text-2xl h-16 w-full rounded-lg transition-transform duration-100 active:scale-95";
  const primaryButtonClass = `${buttonClass} bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80`;
  const secondaryButtonClass = `${buttonClass} bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70`;
  const accentButtonClass = `${buttonClass} bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80`;

  const buttons = [
    { label: 'AC', handler: clearInput, className: accentButtonClass },
    { label: '+/-', handler: toggleSign, className: accentButtonClass },
    { label: '%', handler: handlePercent, className: accentButtonClass },
    { label: '÷', handler: () => handleOperator('/'), className: primaryButtonClass },
    { label: '7', handler: () => inputDigit('7'), className: secondaryButtonClass },
    { label: '8', handler: () => inputDigit('8'), className: secondaryButtonClass },
    { label: '9', handler: () => inputDigit('9'), className: secondaryButtonClass },
    { label: '×', handler: () => handleOperator('*'), className: primaryButtonClass },
    { label: '4', handler: () => inputDigit('4'), className: secondaryButtonClass },
    { label: '5', handler: () => inputDigit('5'), className: secondaryButtonClass },
    { label: '6', handler: () => inputDigit('6'), className: secondaryButtonClass },
    { label: '−', handler: () => handleOperator('-'), className: primaryButtonClass },
    { label: '1', handler: () => inputDigit('1'), className: secondaryButtonClass },
    { label: '2', handler: () => inputDigit('2'), className: secondaryButtonClass },
    { label: '3', handler: () => inputDigit('3'), className: secondaryButtonClass },
    { label: '+', handler: () => handleOperator('+'), className: primaryButtonClass },
    { label: '0', handler: () => inputDigit('0'), customClass: `${secondaryButtonClass} col-span-2` },
    { label: '.', handler: inputDecimal, className: secondaryButtonClass },
    { label: '=', handler: handleEquals, className: primaryButtonClass },
  ];

  return (
    <div className="w-full max-w-sm mx-auto bg-card p-4 sm:p-6 rounded-2xl space-y-4">
        <div className="relative">
            <div className="flex justify-between items-center mb-2">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <History className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Calculation History</SheetTitle>
                        </SheetHeader>
                        {renderHistory()}
                    </SheetContent>
                </Sheet>
                 <Button variant="ghost" size="icon" onClick={backspace} className="text-muted-foreground hover:text-primary">
                    <CornerUpLeft className="h-5 w-5" />
                </Button>
            </div>
            <div className="w-full bg-transparent rounded-lg p-4 text-right overflow-hidden break-words min-h-[6.5rem] flex flex-col justify-end">
                <p className="text-muted-foreground h-6 text-2xl">{fullExpression}</p>
                <span className="text-6xl sm:text-7xl font-light tracking-wider">{displayValue}</span>
            </div>
        </div>
      
      <div className="grid grid-cols-4 grid-rows-5 gap-3">
        {buttons.map(btn => (
          <Button
            key={btn.label}
            onClick={btn.handler}
            className={`${btn.className || ''} ${btn.customClass || ''}`}
          >
            {btn.icon ? <btn.icon /> : btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
