import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Landmark,
  PiggyBank,
  Car,
  CirclePercent,
  HandCoins,
  Building2,
  LineChart,
  Waypoints,
  Receipt,
  GraduationCap,
  Percent,
  FileJson,
  Banknote,
  Briefcase,
  HeartPulse,
  Scale,
  Flame,
  User,
  Activity,
  Footprints,
  Baby,
  Beaker,
  Sigma,
  CalendarDays,
  Clock,
  BookUser,
  ToyBrick,
  Network,
  KeyRound,
  Combine,
  Shuffle,
  Binary,
  GitCommitHorizontal
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
      { name: "Age Calculator", slug: "age-calculator", icon: User, description: "Calculate age from a birth date." },
      { name: "Standard Calculator", slug: "/", icon: Calculator, description: "For basic arithmetic operations." },
      { name: "Percentage Calculator", slug: "percentage-calculator", icon: CirclePercent, description: "Calculate percentages of numbers." },
      { name: "Conversion Calculator", slug: "conversion-calculator", icon: Combine, description: "Convert between different units." },
      { name: "Random Number Generator", slug: "random-number-generator", icon: Shuffle, description: "Generate random numbers." },
      { name: "Password Generator", slug: "password-generator", icon: KeyRound, description: "Create strong, secure passwords." },
    ],
  },
  {
    name: "Financial",
    calculators: [
      { name: "Mortgage Calculator", slug: "mortgage-calculator", icon: Landmark, description: "Estimate your monthly mortgage payments." },
      { name: "Loan Calculator", slug: "loan-calculator", icon: PiggyBank, description: "Calculate loan payments and interest." },
      { name: "Auto Loan Calculator", slug: "auto-loan-calculator", icon: Car, description: "Estimate car loan payments." },
      { name: "Interest Calculator", slug: "interest-calculator", icon: HandCoins, description: "Calculate simple or compound interest." },
      { name: "Payment Calculator", slug: "payment-calculator", icon: Receipt, description: "Calculate loan or lease payments." },
      { name: "Retirement Calculator", slug: "retirement-calculator", icon: Building2, description: "Plan for your retirement savings." },
      { name: "Amortization Calculator", slug: "amortization-calculator", icon: FileJson, description: "View loan amortization schedules." },
      { name: "Investment Calculator", slug: "investment-calculator", icon: LineChart, description: "Project investment growth." },
      { name: "Inflation Calculator", slug: "inflation-calculator", icon: Waypoints, description: "See the impact of inflation on money." },
      { name: "Finance Calculator", slug: "finance-calculator", icon: Banknote, description: "A comprehensive financial tool." },
      { name: "Income Tax Calculator", slug: "income-tax-calculator", icon: Receipt, description: "Estimate your income tax liability." },
      { name: "Compound Interest Calculator", slug: "compound-interest-calculator", icon: Percent, description: "Calculate compound interest." },
      { name: "Salary Calculator", slug: "salary-calculator", icon: Briefcase, description: "Convert salary between periods." },
      { name: "Interest Rate Calculator", slug: "interest-rate-calculator", icon: HandCoins, description: "Find the interest rate of a loan." },
      { name: "Sales Tax Calculator", slug: "sales-tax-calculator", icon: Receipt, description: "Calculate sales tax on a purchase." },
    ],
  },
  {
    name: "Health & Fitness",
    calculators: [
      { name: "BMI Calculator", slug: "bmi-calculator", icon: HeartPulse, description: "Calculate Body Mass Index." },
      { name: "Calorie Calculator", slug: "calorie-calculator", icon: Flame, description: "Estimate your daily calorie needs." },
      { name: "Body Fat Calculator", slug: "body-fat-calculator", icon: User, description: "Estimate your body fat percentage." },
      { name: "BMR Calculator", slug: "bmr-calculator", icon: Activity, description: "Calculate Basal Metabolic Rate." },
      { name: "Ideal Weight Calculator", slug: "ideal-weight-calculator", icon: Scale, description: "Find your ideal body weight." },
      { name: "Pace Calculator", slug: "pace-calculator", icon: Footprints, description: "Calculate running pace, time, and distance." },
      { name: "Pregnancy Calculator", slug: "pregnancy-calculator", icon: Baby, description: "Track your pregnancy milestones." },
      { name: "Pregnancy Conception Calculator", slug: "pregnancy-conception-calculator", icon: Baby, description: "Estimate conception date." },
      { name: "Due Date Calculator", slug: "due-date-calculator", icon: Baby, description: "Calculate your pregnancy due date." },
    ],
  },
   {
    name: "Math & Science",
    calculators: [
      { name: "Scientific Calculator", slug: "scientific-calculator", icon: Beaker, description: "For advanced scientific calculations." },
      { name: "Fraction Calculator", slug: "fraction-calculator", icon: Binary, description: "Perform operations with fractions." },
      { name: "Triangle Calculator", slug: "triangle-calculator", icon: GitCommitHorizontal, description: "Solve triangle properties." },
      { name: "Standard Deviation Calculator", slug: "standard-deviation-calculator", icon: Sigma, description: "Calculate standard deviation." },
    ],
  },
  {
    name: "Date & Time",
    calculators: [
      { name: "Date Calculator", slug: "date-calculator", icon: CalendarDays, description: "Add or subtract days from a date." },
      { name: "Time Calculator", slug: "time-calculator", icon: Clock, description: "Add, subtract, and convert time units." },
      { name: "Hours Calculator", slug: "hours-calculator", icon: Clock, description: "Calculate hours between two times." },
    ],
  },
  {
    name: "Education",
    calculators: [
      { name: "GPA Calculator", slug: "gpa-calculator", icon: GraduationCap, description: "Calculate your Grade Point Average." },
      { name: "Grade Calculator", slug: "grade-calculator", icon: BookUser, description: "Calculate your course grade." },
    ],
  },
  {
    name: "Other",
    calculators: [
      { name: "Concrete Calculator", slug: "concrete-calculator", icon: ToyBrick, description: "Estimate concrete needed for a project." },
      { name: "Subnet Calculator", slug: "subnet-calculator", icon: Network, description: "Calculate IP subnet ranges." },
    ],
  }
];

export const allCalculators = calculatorCategories.flatMap(category => category.calculators);
