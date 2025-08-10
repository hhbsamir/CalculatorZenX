
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Trash2, User, Download, ShieldAlert, Loader2 } from "lucide-react";
import type jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, getDocs, writeBatch } from "firebase/firestore";

interface SavedExperience {
  id: string;
  name: string;
  years: number;
  months: number;
  days: number;
}

export function ExperienceHistory() {
  const { user, loading: authLoading } = useAuth();
  const [savedExperiences, setSavedExperiences] = useState<SavedExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSavedExperiences([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const q = query(collection(db, `users/${user.uid}/experiences`), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const experiences: SavedExperience[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        experiences.push({
          id: doc.id,
          name: data.name,
          years: data.years,
          months: data.months,
          days: data.days,
        });
      });
      setSavedExperiences(experiences);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching experiences: ", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const clearSavedExperiences = async () => {
    if(!user) return;
    try {
      const q = query(collection(db, `users/${user.uid}/experiences`));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
        console.error("Failed to clear experiences from Firestore", error);
    }
  }

  const downloadPdf = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Saved Work Experiences", 14, 22);
    
    autoTable(doc, {
      startY: 30,
      head: [['Name', 'Years', 'Months', 'Days']],
      body: savedExperiences.map(exp => [exp.name, exp.years, exp.months, exp.days]),
      headStyles: { fillColor: [24, 96, 53] }, // Primary color
      styles: { cellPadding: 3, fontSize: 10 },
    });

    doc.save('experience_history.pdf');
  };
  
  const renderContent = () => {
      if (authLoading || isLoading) {
          return (
               <div className="text-center text-muted-foreground py-12">
                    <Loader2 className="mx-auto h-16 w-16 mb-4 animate-spin"/>
                    <p className="text-xl font-medium">Loading Experiences...</p>
                </div>
          )
      }
      if (!user) {
         return (
            <div className="text-center text-muted-foreground py-12">
                <ShieldAlert className="mx-auto h-16 w-16 mb-4 text-destructive"/>
                <p className="text-xl font-medium">Please sign in to view your saved experiences.</p>
            </div>
          )
      }
      if (savedExperiences.length === 0) {
          return (
            <div className="text-center text-muted-foreground py-12">
                <History className="mx-auto h-16 w-16 mb-4"/>
                <p className="text-xl font-medium">No Saved Experiences Yet</p>
                <p>Go to tab 'a' to calculate and save a new experience.</p>
            </div>
          )
      }
      return (
        <>
            <div className="flex justify-end gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={downloadPdf}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
                <Button variant="outline" size="sm" onClick={clearSavedExperiences}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear History
                </Button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {savedExperiences.map((exp, index) => (
                <div key={exp.id} className="p-4 bg-secondary rounded-lg flex items-center justify-between">
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
      )
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
        {renderContent()}
      </CardContent>
    </Card>
  );
}
