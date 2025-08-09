import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  User,
  FlaskConical,
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
      { name: "Scientific Calculator", slug: "scientific-calculator", icon: FlaskConical, description: "For more complex calculations." },
      { name: "Age Calculator", slug: "age-calculator", icon: User, description: "Calculate age from a birth date." },
    ],
  },
];

export const allCalculators = calculatorCategories.flatMap(category => category.calculators);
