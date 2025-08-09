"use client";

import { History, Copy, Trash2, CornerUpLeft, Percent, Divide, X, Minus, Plus, Equal, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { useScientificCalculator, type HistoryItem } from '@/hooks/use-scientific-calculator';
import { ScrollArea } from './ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useToast } from "@/hooks/use-toast"

export function ScientificCalculator() {
  const { toast } = useToast()
  const {
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
  } = useScientificCalculator();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(state.display);
    toast({
      title: "Copied to clipboard!",
      description: "The result has been copied to your clipboard.",
    })
  }

  const renderHistory = () => (
    <div className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Calculation History</SheetTitle>
          <SheetDescription>
            Click on a previous calculation to use it again.
          </SheetDescription>
        </SheetHeader>
      {state.history.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow text-center text-muted-foreground">
          <History className="w-16 h-16 mb-4" />
          <p className="text-lg">No history yet.</p>
          <p>Your past calculations will appear here.</p>
        </div>
      ) : (
        <>
        <ScrollArea className="flex-grow my-4 pr-6">
          <div className="space-y-4">
            {state.history.map((item: HistoryItem, index: number) => (
              <div key={index} className="text-right transition-colors hover:bg-muted/50 p-2 rounded-md">
                <p className="text-sm text-muted-foreground cursor-pointer" onClick={() => inputFunction(item.expression)}>{item.expression} =</p>
                <p className="text-2xl font-bold cursor-pointer" onClick={() => inputFunction(item.result)}>{item.result}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <SheetFooter className="mt-auto pt-4 border-t">
            <Button variant="outline" onClick={clearHistory}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear History
            </Button>
            <SheetClose asChild>
                <Button>Close</Button>
            </SheetClose>
        </SheetFooter>
        </>
      )}
    </div>
  );

  const buttonClass = "text-lg sm:text-xl h-12 sm:h-14 transition-transform duration-100 active:scale-95 focus:z-10";
  const primaryButtonClass = `${buttonClass} bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30`;
  const secondaryButtonClass = `${buttonClass} bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70`;
  const accentButtonClass = `${buttonClass} bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80`;

  return (
    <div className="w-full max-w-2xl mx-auto bg-card p-2 sm:p-4 rounded-2xl shadow-2xl space-y-2 sm:space-y-4 border">
      {/* Display */}
      <div className="relative bg-background/50 rounded-lg p-4 text-right overflow-hidden break-words min-h-[7rem] sm:min-h-[8rem] flex flex-col justify-end">
        <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
          <Sheet>
              <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                      <History className="h-5 w-5" />
                  </Button>
              </SheetTrigger>
              <SheetContent>
                  {renderHistory()}
              </SheetContent>
          </Sheet>
          <ToggleGroup type="single" defaultValue="deg" onValueChange={(value) => setAngleMode(value as 'deg' | 'rad')} aria-label="Angle Mode">
            <ToggleGroupItem value="deg" aria-label="Degrees" className="h-8 px-2 text-xs">Deg</ToggleGroupItem>
            <ToggleGroupItem value="rad" aria-label="Radians" className="h-8 px-2 text-xs">Rad</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <p className="text-muted-foreground h-6 text-sm sm:text-base">{state.expression}</p>
        <div className="flex items-center justify-end">
            <span className="text-4xl sm:text-5xl font-bold tracking-wider">{state.display}</span>
            <Button variant="ghost" size="icon" className="text-muted-foreground ml-2 h-8 w-8" onClick={handleCopyToClipboard}>
                <Copy className="h-5 w-5" />
            </Button>
        </div>
      </div>
      
      {/* Buttons */}
      <div className="grid grid-cols-7 gap-2">
        {/* Row 1 */}
        <Button className={secondaryButtonClass} onClick={() => inputFunction('^2')}>x²</Button>
        <Button className={secondaryButtonClass} onClick={() => inputFunction('^')}>xʸ</Button>
        <Button className={secondaryButtonClass} onClick={() => inputFunction('sin(')}>sin</Button>
        <Button className={secondaryButtonClass} onClick={() => inputFunction('cos(')}>cos</Button>
        <Button className={secondaryButtonClass} onClick={() => inputFunction('tan(')}>tan</Button>
        <Button className={accentButtonClass} onClick={clear}>C</Button>
        <Button className={accentButtonClass} onClick={backspace}><CornerUpLeft /></Button>

        {/* Row 2 */}
        <Button className={secondaryButtonClass} onClick={() => inputFunction('sqrt(')}>√</Button>
        <Button className={secondaryButtonClass} onClick={() => inputFunction('10^')}>10ˣ</Button>
        <Button className={secondaryButtonClass} onClick={() => inputFunction('log10(')}>log</Button>
        <Button className={buttonClass} onClick={() => inputDigit('7')}>7</Button>
        <Button className={buttonClass} onClick={() => inputDigit('8')}>8</Button>
        <Button className={buttonClass} onClick={() => inputDigit('9')}>9</Button>
        <Button className={primaryButtonClass} onClick={() => inputOperator('/')}><Divide /></Button>

        {/* Row 3 */}
        <Button className={secondaryButtonClass} onClick={() => inputFunction('E')}>e</Button>
        <Button className={secondaryButtonClass} onClick={() => inputFunction('exp(')}>eˣ</Button>
        <Button className={secondaryButtonClass} onClick={() => inputFunction('ln(')}>ln</Button>
        <Button className={buttonClass} onClick={() => inputDigit('4')}>4</Button>
        <Button className={buttonClass} onClick={() => inputDigit('5')}>5</Button>
        <Button className={buttonClass} onClick={() => inputDigit('6')}>6</Button>
        <Button className={primaryButtonClass} onClick={() => inputOperator('*')}><X /></Button>

        {/* Row 4 */}
        <Button className={secondaryButtonClass} onClick={() => inputFunction('(')}>(</Button>
        <Button className={secondaryButtonClass} onClick={() => inputFunction(')')}>)</Button>
        <Button className={secondaryButtonClass} onClick={() => inputFunction('!')}>n!</Button>
        <Button className={buttonClass} onClick={() => inputDigit('1')}>1</Button>
        <Button className={buttonClass} onClick={() => inputDigit('2')}>2</Button>
        <Button className={buttonClass} onClick={() => inputDigit('3')}>3</Button>
        <Button className={primaryButtonClass} onClick={() => inputOperator('-')}><Minus /></Button>
        
        {/* Row 5 */}
        <Button className={secondaryButtonClass} onClick={toggleSign}><PlusSquare/></Button>
        <Button className={secondaryButtonClass} onClick={() => inputFunction('pi')}>π</Button>
        <Button className={secondaryButtonClass} onClick={inputPercent}><Percent /></Button>
        <Button className={`${buttonClass} col-span-2`} onClick={() => inputDigit('0')}>0</Button>
        <Button className={buttonClass} onClick={() => inputDigit('.')}>.</Button>
        <Button className={primaryButtonClass} onClick={calculate}><Equal /></Button>
      </div>
    </div>
  );
}
