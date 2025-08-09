import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  User,
  Sigma,
} from "lucide-react";

export interface CalculatorInfo {
  name: string;
  slug: string;
  icon: LucideIcon;
  description?: string;
}

export interface CalculatorCategory {
  name: string;
  calculators: CalculatorInfo[];
}

export const calculatorCategories: CalculatorCategory[] = [
  {
    name: "General",
    calculators: [
      { name: "Standard Calculator", slug: "/", icon: Calculator, description: "For basic arithmetic operations." },
      { name: "Age Calculator", slug: "age-calculator", icon: User, description: "Calculate age from a birth date." },
      { name: "Scientific Calculator", slug: "/scientific-calculator", icon: Sigma, description: "For more complex calculations." },
    ],
  },
];

export const allCalculators = calculatorCategories.flatMap(category => category.calculators);
