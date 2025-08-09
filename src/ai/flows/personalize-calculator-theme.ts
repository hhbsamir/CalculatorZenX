'use server';

/**
 * @fileOverview A flow that personalizes the calculator's color theme based on user preferences.
 *
 * - personalizeCalculatorTheme - A function that handles the theme personalization process.
 * - PersonalizeCalculatorThemeInput - The input type for the personalizeCalculatorTheme function.
 * - PersonalizeCalculatorThemeOutput - The return type for the personalizeCalculatorTheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeCalculatorThemeInputSchema = z.object({
  themeDescription: z
    .string()
    .describe('A description of the desired calculator theme.'),
});
export type PersonalizeCalculatorThemeInput = z.infer<
  typeof PersonalizeCalculatorThemeInputSchema
>;

const PersonalizeCalculatorThemeOutputSchema = z.object({
  primaryColor: z
    .string()
    .describe(
      'The primary color for the calculator theme, in hex format (e.g., #RRGGBB).'
    ),
  backgroundColor: z
    .string()
    .describe(
      'The background color for the calculator theme, in hex format (e.g., #RRGGBB).'
    ),
  accentColor: z
    .string()
    .describe(
      'The accent color for the calculator theme, in hex format (e.g., #RRGGBB).'
    ),
  font: z.string().describe('The font to use for the calculator theme.'),
});
export type PersonalizeCalculatorThemeOutput = z.infer<
  typeof PersonalizeCalculatorThemeOutputSchema
>;

export async function personalizeCalculatorTheme(
  input: PersonalizeCalculatorThemeInput
): Promise<PersonalizeCalculatorThemeOutput> {
  return personalizeCalculatorThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeCalculatorThemePrompt',
  input: {schema: PersonalizeCalculatorThemeInputSchema},
  output: {schema: PersonalizeCalculatorThemeOutputSchema},
  prompt: `You are an expert in UI/UX design, specializing in color schemes.

  Based on the user's description, generate a color scheme for a calculator application.
  Provide the primary color, background color, and accent color in hex format (e.g., #RRGGBB).
  Also, suggest a suitable font for the calculator's UI.

  User's theme description: {{{themeDescription}}}
  `,
});

const personalizeCalculatorThemeFlow = ai.defineFlow(
  {
    name: 'personalizeCalculatorThemeFlow',
    inputSchema: PersonalizeCalculatorThemeInputSchema,
    outputSchema: PersonalizeCalculatorThemeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
