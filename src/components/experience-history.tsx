
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Trash2, User } from "lucide-react";

interface SavedExperience {
  name: string;
  years: number;
  months: number;
  days: number;
}

export function ExperienceHistory() {
  const [savedExperiences, setSavedExperiences] = useState<SavedExperience[]>([]);

  useEffect(() => {
    try {
      const storedExperiences = localStorage.getItem('dairyExperience');
      if (storedExperiences) {
        setSavedExperiences(JSON.parse(storedExperiences));
      }
    } catch (error) {
      console.error("Failed to load experiences from localStorage", error);
    }
  }, []);

  const clearSavedExperiences = () => {
    try {
      localStorage.removeItem('dairyExperience');
      setSavedExperiences([]);
    } catch (error) {
        console.error("Failed to clear experiences from localStorage", error);
    }
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="text-center">
         <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
          <History className="h-10 w-10" />
        </div>
        <CardTitle className="text-3xl font-bold">Saved Experiences</CardTitle>
        <CardDescription className="text-lg">
          A list of all the work experiences you have saved.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
          {savedExperiences.length > 0 ? (
            <>
                <div className="flex justify-end mb-4">
                    <Button variant="outline" size="sm" onClick={clearSavedExperiences}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear History
                    </Button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {savedExperiences.map((exp, index) => (
                    <div key={index} className="p-4 bg-secondary rounded-lg flex items-center justify-between">
                        <div>
                            <p className="text-lg font-bold text-secondary-foreground flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {exp.name}
                            </p>
                            <p className="text-md text-secondary-foreground/80">
                                {exp.years} years, {exp.months} months, {exp.days} days
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-12">
                <History className="mx-auto h-16 w-16 mb-4"/>
                <p className="text-xl font-medium">No Saved Experiences Yet</p>
                <p>Go to tab 'a' to calculate and save a new experience.</p>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
