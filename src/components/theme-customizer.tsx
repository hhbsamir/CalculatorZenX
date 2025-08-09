"use client";

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { getNewTheme } from '@/app/actions';
import { hexToHsl } from '@/lib/colors';
import type { PersonalizeCalculatorThemeOutput } from '@/ai/flows/personalize-calculator-theme';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Generating...' : 'Personalize with AI'}
      <Wand2 className="ml-2" />
    </Button>
  );
}

export function ThemeCustomizer() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [initialState, setInitialState] = useState<{data?: PersonalizeCalculatorThemeOutput, error?: string}>({});

  const [state, formAction] = useActionState(getNewTheme, initialState);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Theme Generation Error',
        description: state.error,
      });
    }

    if (state.data) {
      const { primaryColor, backgroundColor, accentColor, font } = state.data;
      
      try {
        const [primaryH, primaryS, primaryL] = hexToHsl(primaryColor);
        const [bgH, bgS, bgL] = hexToHsl(backgroundColor);
        const [accentH, accentS, accentL] = hexToHsl(accentColor);
        
        const root = document.documentElement;
        root.style.setProperty('--primary', `${primaryH} ${primaryS}% ${primaryL}%`);
        root.style.setProperty('--background', `${bgH} ${bgS}% ${bgL}%`);
        root.style.setProperty('--accent', `${accentH} ${accentS}% ${accentL}%`);
        
        // Simple foreground derivation
        const bgLightness = bgL;
        const fgColor = bgLightness > 50 ? `hsl(${bgH}, 10%, 10%)` : `hsl(${bgH}, 10%, 95%)`;
        root.style.setProperty('--foreground', bgLightness > 50 ? `${bgH} 10% 10%` : `${bgH} 10% 95%`);

        // Simple card/border color derivation
        const cardBg = `hsl(${bgH}, ${bgS}%, ${bgLightness > 50 ? bgL * 0.98 : bgL * 1.2})`;
        root.style.setProperty('--card', bgLightness > 50 ? `${bgH} ${bgS}% ${bgL * 0.98}%` : `${bgH} ${bgS}% ${bgL * 1.2}%`);
        root.style.setProperty('--border', `hsl(${bgH}, ${bgS*0.5}%, ${bgLightness > 50 ? bgL * 0.9 : bgL * 1.3})`);
        root.style.setProperty('--input', `hsl(${bgH}, ${bgS*0.5}%, ${bgLightness > 50 ? bgL * 0.9 : bgL * 1.3})`);

        // Update font
        if (font) {
          const fontLink = document.createElement('link');
          fontLink.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}&display=swap`;
          fontLink.rel = 'stylesheet';
          document.head.appendChild(fontLink);
          document.body.style.fontFamily = `'${font}', sans-serif`;
        }

        toast({
          title: 'Theme Updated!',
          description: 'Your new theme has been applied.',
        });
        setOpen(false);
      } catch (e) {
         toast({
          variant: 'destructive',
          title: 'Color Application Error',
          description: 'The AI generated invalid colors. Please try again.',
        });
      }
    }
  }, [state, toast]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="justify-start w-full">
          <Wand2 className="mr-2 h-4 w-4" />
          Personalize Theme
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Personalize Your Calculator</SheetTitle>
          <SheetDescription>
            Describe the theme you want, and our AI will create a unique color scheme and font pairing just for you.
          </SheetDescription>
        </SheetHeader>
        <form action={formAction} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="themeDescription">Theme Description</Label>
            <Input
              id="themeDescription"
              name="themeDescription"
              placeholder="e.g., 'a calm ocean sunset'"
              required
            />
          </div>
          <SubmitButton />
        </form>
      </SheetContent>
    </Sheet>
  );
}
