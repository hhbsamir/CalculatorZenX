'use server';

import { personalizeCalculatorTheme } from '@/ai/flows/personalize-calculator-theme';
import { z } from 'zod';

const themeSchema = z.object({
  themeDescription: z.string().min(3, "Please describe the theme in a bit more detail."),
});

export async function getNewTheme(prevState: any, formData: FormData) {
  const validatedFields = themeSchema.safeParse({
    themeDescription: formData.get('themeDescription'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.themeDescription?.[0],
    };
  }

  try {
    const result = await personalizeCalculatorTheme({
      themeDescription: validatedFields.data.themeDescription,
    });
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate theme. Please try again.' };
  }
}
