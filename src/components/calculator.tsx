"use client";

import { History, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { useCalculator, type HistoryItem } from '@/hooks/use-calculator';
import { ScrollArea } from './ui/scroll-area';

export function Calculator() {
  const {
    displayValue,
    history,
    inputDigit,
    inputDecimal,
    clearInput,
    handleOperator,
    handleEquals,
    clearHistory,
    handlePercent,
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

  const buttons = [
    { label: 'AC', handler: clearInput, className: 'bg-accent text-accent-foreground hover:bg-accent/90' },
    { label: '%', handler: handlePercent, className: 'bg-accent text-accent-foreground hover:bg-accent/90', icon: Percent },
    { label: '÷', handler: () => handleOperator('/'), className: 'bg-primary text-primary-foreground hover:bg-primary/90' },
    { label: '×', handler: () => handleOperator('*'), className: 'bg-primary text-primary-foreground hover:bg-primary/90' },
    { label: '7', handler: () => inputDigit('7') },
    { label: '8', handler: () => inputDigit('8') },
    { label: '9', handler: () => inputDigit('9') },
    { label: '−', handler: () => handleOperator('-'), className: 'bg-primary text-primary-foreground hover:bg-primary/90' },
    { label: '4', handler: () => inputDigit('4') },
    { label: '5', handler: () => inputDigit('5') },
    { label: '6', handler: () => inputDigit('6') },
    { label: '+', handler: () => handleOperator('+'), className: 'bg-primary text-primary-foreground hover:bg-primary/90' },
    { label: '1', handler: () => inputDigit('1') },
    { label: '2', handler: () => inputDigit('2') },
    { label: '3', handler: () => inputDigit('3') },
    { label: '=', handler: handleEquals, className: 'row-span-2 bg-primary text-primary-foreground hover:bg-primary/90' },
    { label: '0', handler: () => inputDigit('0'), className: 'col-span-2' },
    { label: '.', handler: inputDecimal },
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-card p-4 sm:p-6 rounded-2xl shadow-2xl space-y-4 border">
        <div className="relative">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-0 left-0 text-muted-foreground">
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
            <div className="w-full bg-background/50 rounded-lg p-4 text-right overflow-hidden break-words">
                <span className="text-5xl font-bold tracking-wider">{displayValue}</span>
            </div>
        </div>
      
      <div className="grid grid-cols-4 grid-rows-5 gap-2 sm:gap-3">
        {buttons.map(btn => (
          <Button
            key={btn.label}
            onClick={btn.handler}
            className={`text-2xl h-16 sm:h-20 transition-transform duration-100 active:scale-95 ${btn.className || 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            {btn.icon ? <btn.icon /> : btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
