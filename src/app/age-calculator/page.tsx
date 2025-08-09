
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, User } from "lucide-react";

interface Age {
  years: number;
  months: number;
  days: number;
}

interface AgeDetails {
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
}

export default function AgeCalculatorPage() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [age, setAge] = useState<Age | null>(null);
  const [ageDetails, setAgeDetails] = useState<AgeDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set the "To Date" to today's date on initial render
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    setToDate(formattedToday);
  }, []);


  const calculateAge = () => {
    if (!fromDate || !toDate) {
      setError("Please enter both 'From Date' and 'To Date'.");
      setAge(null);
      setAgeDetails(null);
      return;
    }

    const birth = new Date(fromDate);
    const today = new Date(toDate);

    if (isNaN(birth.getTime()) || isNaN(today.getTime())) {
      setError("Invalid date format. Please use YYYY-MM-DD.");
      setAge(null);
      setAgeDetails(null);
      return;
    }
    
    if (birth > today) {
        setError("'From Date' cannot be in the future of 'To Date'.");
        setAge(null);
        setAgeDetails(null);
        return;
    }

    setError(null);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }
    setAge({ years, months, days });
    
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    setAgeDetails({ totalMonths, totalWeeks, totalDays, totalHours, totalMinutes });
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="text-center">
         <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
          <User className="h-10 w-10" />
        </div>
        <CardTitle className="text-3xl font-bold">Age & Date Calculator</CardTitle>
        <CardDescription className="text-lg">
          Calculate the duration between two dates or find your age.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="grid gap-1.5">
            <Label htmlFor="from-date">From Date (or Date of Birth)</Label>
            <Input
              id="from-date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-12 text-lg"
            />
          </div>
           <div className="grid gap-1.5">
            <Label htmlFor="to-date">To Date</Label>
            <Input
              id="to-date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-12 text-lg"
            />
          </div>
        </div>
         <Button onClick={calculateAge} className="w-full h-12 text-lg">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Calculate
          </Button>
        {error && <p className="text-destructive text-center font-medium">{error}</p>}
        {age && (
          <div className="space-y-4 pt-4 border-t">
            <div className="text-center">
                <p className="text-muted-foreground text-lg">Calculated Duration</p>
                <p className="text-5xl font-bold text-primary">
                    {age.years} <span className="text-3xl font-medium text-foreground">years</span>, {age.months} <span className="text-3xl font-medium text-foreground">months</span>, {age.days} <span className="text-3xl font-medium text-foreground">days</span>
                </p>
            </div>
            
            {ageDetails && (
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-muted-foreground">in Months</p>
                        <p className="text-2xl font-bold">{ageDetails.totalMonths} months</p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-muted-foreground">in Weeks</p>
                        <p className="text-2xl font-bold">{ageDetails.totalWeeks.toLocaleString()} weeks</p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-muted-foreground">in Days</p>
                        <p className="text-2xl font-bold">{ageDetails.totalDays.toLocaleString()} days</p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-muted-foreground">in Hours</p>
                        <p className="text-2xl font-bold">{ageDetails.totalHours.toLocaleString()} hours</p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg col-span-2 md:col-span-1">
                        <p className="text-muted-foreground">in Minutes</p>
                        <p className="text-2xl font-bold">{ageDetails.totalMinutes.toLocaleString()} minutes</p>
                    </div>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
