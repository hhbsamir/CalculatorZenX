
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, User, ArrowRight, Gift } from "lucide-react";
import { differenceInDays, differenceInMonths, differenceInYears, addYears, formatDistanceStrict, parseISO } from 'date-fns';

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
  const [nextBirthday, setNextBirthday] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);

  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    setToDate(formattedToday);
  }, []);

  const calculateAge = () => {
    if (!fromDate || !toDate) {
      setError("Please enter both 'From Date' and 'To Date'.");
      setAge(null);
      setAgeDetails(null);
      setNextBirthday(null);
      setIsBirthdayToday(false);
      return;
    }

    const birthDate = parseISO(fromDate);
    const endDate = parseISO(toDate);

    if (isNaN(birthDate.getTime()) || isNaN(endDate.getTime())) {
      setError("Invalid date format. Please use YYYY-MM-DD.");
      setAge(null);
      setAgeDetails(null);
      setNextBirthday(null);
      setIsBirthdayToday(false);
      return;
    }
    
    if (birthDate > endDate) {
        setError("'From Date' cannot be in the future of 'To Date'.");
        setAge(null);
        setAgeDetails(null);
        setNextBirthday(null);
        setIsBirthdayToday(false);
        return;
    }

    setError(null);

    const years = differenceInYears(endDate, birthDate);
    let months = differenceInMonths(endDate, birthDate) % 12;
    let days = endDate.getDate() - birthDate.getDate();

    if (days < 0) {
      const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += prevMonth.getDate();
      months = (months -1 + 12) % 12;
    }
    
    setAge({ years, months, days });
    
    const totalDays = differenceInDays(endDate, birthDate);
    const totalMonths = differenceInMonths(endDate, birthDate);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    setAgeDetails({ totalMonths, totalWeeks, totalDays, totalHours, totalMinutes });

    const today = new Date();
    today.setHours(0,0,0,0);
    const birthDateThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate()){
      setIsBirthdayToday(true);
      setNextBirthday(null);
    } else {
      setIsBirthdayToday(false);
      let nextBirthdayDate = birthDateThisYear;
      if(nextBirthdayDate < today) {
        nextBirthdayDate = addYears(birthDateThisYear, 1);
      }
      setNextBirthday(formatDistanceStrict(nextBirthdayDate, today));
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="text-center">
         <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
          <User className="h-10 w-10" />
        </div>
        <CardTitle className="text-3xl font-bold">Age & Date Calculator</CardTitle>
        <CardDescription className="text-lg">
          Calculate the duration between two dates or find your exact age and time until your next birthday.
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
          <div className="space-y-6 pt-6 border-t">
            <div className="text-center">
                <p className="text-muted-foreground text-lg font-medium">Calculated Duration</p>
                <p className="text-5xl font-bold text-primary">
                    {age.years} <span className="text-3xl font-medium text-foreground">years</span>, {age.months} <span className="text-3xl font-medium text-foreground">months</span>, {age.days} <span className="text-3xl font-medium text-foreground">days</span>
                </p>
            </div>
            
            {ageDetails && (
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-muted-foreground">in Months</p>
                        <p className="text-2xl font-bold">{ageDetails.totalMonths.toLocaleString()} </p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-muted-foreground">in Weeks</p>
                        <p className="text-2xl font-bold">{ageDetails.totalWeeks.toLocaleString()}</p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-muted-foreground">in Days</p>
                        <p className="text-2xl font-bold">{ageDetails.totalDays.toLocaleString()}</p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-muted-foreground">in Hours</p>
                        <p className="text-2xl font-bold">{ageDetails.totalHours.toLocaleString()}</p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg col-span-2 md:col-span-1">
                        <p className="text-muted-foreground">in Minutes</p>
                        <p className="text-2xl font-bold">{ageDetails.totalMinutes.toLocaleString()}</p>
                    </div>
                </div>
            )}
             {isBirthdayToday && (
              <div className="text-center bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 p-4 rounded-lg">
                <p className="text-2xl font-bold">🎉 Happy Birthday! 🎉</p>
              </div>
            )}
            {nextBirthday && !isBirthdayToday && (
              <div className="text-center">
                <p className="text-muted-foreground text-lg font-medium">Next Birthday</p>
                <p className="text-3xl font-bold text-accent flex items-center justify-center gap-2">
                    <Gift className="h-8 w-8"/>
                    <span>in {nextBirthday}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
