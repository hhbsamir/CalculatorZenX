
"use client";

import { useState } from "react";
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

interface NextBirthday {
  months: number;
  days: number;
}

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState<string>("");
  const [age, setAge] = useState<Age | null>(null);
  const [ageDetails, setAgeDetails] = useState<AgeDetails | null>(null);
  const [nextBirthday, setNextBirthday] = useState<NextBirthday | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateAge = () => {
    if (!birthDate) {
      setError("Please enter your date of birth.");
      setAge(null);
      setAgeDetails(null);
      setNextBirthday(null);
      return;
    }

    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) {
      setError("Invalid date format. Please use YYYY-MM-DD.");
      setAge(null);
      setAgeDetails(null);
      setNextBirthday(null);
      return;
    }
    
    const today = new Date();
    if (birth > today) {
        setError("Date of birth cannot be in the future.");
        setAge(null);
        setAgeDetails(null);
        setNextBirthday(null);
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


    let nextBirthdayDate = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthdayDate < today) {
        nextBirthdayDate.setFullYear(today.getFullYear() + 1);
    }
    
    let nextBdayMonths = nextBirthdayDate.getMonth() - today.getMonth();
    let nextBdayDays = nextBirthdayDate.getDate() - today.getDate();

    if(nextBdayDays < 0) {
        nextBdayMonths -= 1;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        nextBdayDays += prevMonth.getDate();
    }

     if (nextBdayMonths < 0) {
      nextBdayMonths += 12;
    }
    
    setNextBirthday({ months: nextBdayMonths, days: nextBdayDays });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
         <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
          <User className="h-10 w-10" />
        </div>
        <CardTitle className="text-3xl font-bold">Age Calculator</CardTitle>
        <CardDescription className="text-lg">
          Calculate your age and see interesting details about your life in numbers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="grid w-full sm:w-auto flex-1 gap-1.5">
            <Label htmlFor="dob">Enter your date of birth</Label>
            <Input
              id="dob"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="h-12 text-lg"
            />
          </div>
          <Button onClick={calculateAge} className="w-full sm:w-auto h-12 self-end text-lg">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Calculate Age
          </Button>
        </div>
        {error && <p className="text-destructive text-center font-medium">{error}</p>}
        {age && (
          <div className="space-y-4 pt-4 border-t">
            <div className="text-center">
                <p className="text-muted-foreground text-lg">Your Age Is</p>
                <p className="text-5xl font-bold text-primary">
                    {age.years} <span className="text-3xl font-medium text-foreground">years</span>, {age.months} <span className="text-3xl font-medium text-foreground">months</span>, {age.days} <span className="text-3xl font-medium text-foreground">days</span>
                </p>
            </div>
            
            {ageDetails && (
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
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
                     <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-muted-foreground">in Minutes</p>
                        <p className="text-2xl font-bold">{ageDetails.totalMinutes.toLocaleString()} minutes</p>
                    </div>
                     {nextBirthday && (
                        <div className="bg-secondary p-4 rounded-lg">
                            <p className="text-muted-foreground">Next Birthday</p>
                            <p className="text-2xl font-bold">{nextBirthday.months}m {nextBirthday.days}d</p>
                        </div>
                    )}
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    