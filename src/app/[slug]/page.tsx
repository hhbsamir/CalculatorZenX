import { allCalculators } from '@/lib/calculators';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExperienceCalculator } from '@/components/experience-calculator';

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return allCalculators.filter(c => c.slug !== '/' && c.slug !== 'scientific-calculator' && c.slug !== 'age-calculator').map((calc) => ({
    slug: calc.slug,
  }));
}

export default function CalculatorPage({ params }: Props) {
  if (params.slug === 'a') {
    return <ExperienceCalculator />;
  }
  
  const calculator = allCalculators.find((calc) => calc.slug === params.slug);

  if (!calculator) {
    notFound();
  }

  const Icon = calculator.icon;

  return (
    <Card className="w-full max-w-2xl text-center">
      <CardHeader>
        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
          <Icon className="h-10 w-10" />
        </div>
        <CardTitle className="text-3xl font-bold">{calculator.name}</CardTitle>
        <CardDescription className="text-lg">
          {calculator.description || 'This feature is under construction.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          The {calculator.name} is coming soon! We are working hard to bring you this feature.
        </p>
        <Button asChild>
          <Link href="/">Back to Standard Calculator</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
