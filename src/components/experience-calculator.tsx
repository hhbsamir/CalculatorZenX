
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Plus, Trash2, Briefcase, Save, User } from "lucide-react";
import { differenceInDays, parseISO } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

interface WorkPeriod {
  id: number;
  from: string;
  to: string;
}

interface TotalExperience {
  years: number;
  months: number;
  days: number;
}

interface SavedExperience extends TotalExperience {
    name: string;
}

export function ExperienceCalculator() {
  const { toast } = useToast();
  const [personName, setPersonName] = useState<string>("");
  const [workPeriods, setWorkPeriods] = useState<WorkPeriod[]>([{ id: 1, from: "", to: "" }]);
  const [totalExperience, setTotalExperience] = useState<TotalExperience | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePeriodChange = (id: number, field: 'from' | 'to', value: string) => {
    const newPeriods = workPeriods.map(p => p.id === id ? { ...p, [field]: value } : p);
    setWorkPeriods(newPeriods);
    setTotalExperience(null);
  };

  const addPeriod = () => {
    setWorkPeriods([...workPeriods, { id: Date.now(), from: "", to: "" }]);
  };

  const removePeriod = (id: number) => {
    if (workPeriods.length > 1) {
      setWorkPeriods(workPeriods.filter(p => p.id !== id));
    }
  };

  const calculateTotalExperience = () => {
    let totalDays = 0;
    setError(null);
    setTotalExperience(null);

    for (const period of workPeriods) {
      if (!period.from || !period.to) {
        setError("Please fill in all 'From' and 'To' dates.");
        return;
      }

      const fromDate = parseISO(period.from);
      const toDate = parseISO(period.to);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        setError("Invalid date format. Please use YYYY-MM-DD.");
        return;
      }
      
      if (fromDate > toDate) {
        setError("'From Date' cannot be after 'To Date' in any period.");
        return;
      }
      
      totalDays += differenceInDays(toDate, fromDate) + 1; // Inclusive of end date
    }

    if (totalDays > 0) {
        let years = Math.floor(totalDays / 365.25);
        let remainingDays = totalDays % 365.25;
        let months = Math.floor(remainingDays / 30.44);
        let days = Math.round(remainingDays % 30.44);
        
        if (days >= 30) {
            months += 1;
            days = 0;
        }
        if(months >= 12){
            years += 1;
            months = 0;
        }

        setTotalExperience({ years, months, days });
    }
  };

  const saveExperience = () => {
    if (!personName.trim()) {
        toast({
            title: "Name required",
            description: "Please enter the person's name.",
            variant: "destructive",
        });
        return;
    }
    if (totalExperience) {
      try {
        const storedExperiences = localStorage.getItem('dairyExperience');
        const savedExperiences = storedExperiences ? JSON.parse(storedExperiences) : [];
        const newSavedExperience: SavedExperience = { name: personName, ...totalExperience };
        const newSavedExperiences = [newSavedExperience, ...savedExperiences];
        localStorage.setItem('dairyExperience', JSON.stringify(newSavedExperiences));
        toast({
            title: "Experience Saved!",
            description: `Experience for ${personName} saved. View saved experiences in tab 'b'.`,
        });
      } catch (error) {
        console.error("Failed to save experience to localStorage", error);
        toast({
            title: "Error",
            description: "Could not save the experience.",
            variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="text-center">
         <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
          <Briefcase className="h-10 w-10" />
        </div>
        <CardTitle className="text-3xl font-bold">Dairy Experience Calculator</CardTitle>
        <CardDescription className="text-lg">
          Calculate total work experience from multiple periods.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-1.5">
            <Label htmlFor="person-name">Person's Name</Label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="person-name"
                    type="text"
                    placeholder="Enter name"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    className="h-12 text-lg pl-10"
                />
            </div>
        </div>
        {workPeriods.map((period, index) => (
          <div key={period.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end relative">
            <div className="grid gap-1.5">
              <Label htmlFor={`from-date-${period.id}`}>From Date</Label>
              <Input
                id={`from-date-${period.id}`}
                type="date"
                value={period.from}
                onChange={(e) => handlePeriodChange(period.id, 'from', e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor={`to-date-${period.id}`}>To Date</Label>
              <Input
                id={`to-date-${period.id}`}
                type="date"
                value={period.to}
                onChange={(e) => handlePeriodChange(period.id, 'to', e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            {workPeriods.length > 1 && (
              <Button variant="ghost" size="icon" className="absolute -right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive" onClick={() => removePeriod(period.id)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        ))}
         <Button onClick={addPeriod} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add another period
          </Button>
         <Button onClick={calculateTotalExperience} className="w-full h-12 text-lg">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Calculate Total Experience
          </Button>
        {error && <p className="text-destructive text-center font-medium">{error}</p>}
      </CardContent>
      {totalExperience && (
        <CardFooter className="flex-col pt-6 border-t space-y-4">
           <div className="text-center w-full">
                <p className="text-muted-foreground text-lg font-medium">Total Calculated Experience</p>
                <p className="text-5xl font-bold text-primary">
                    {totalExperience.years} <span className="text-3xl font-medium text-foreground">years</span>, {totalExperience.months} <span className="text-3xl font-medium text-foreground">months</span>, {totalExperience.days} <span className="text-3xl font-medium text-foreground">days</span>
                </p>
            </div>
            <Button onClick={saveExperience} className="w-full sm:w-auto">
                <Save className="mr-2 h-5 w-5" />
                Save Experience
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
