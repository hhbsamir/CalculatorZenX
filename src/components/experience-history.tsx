
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

    // Set document properties
    doc.setProperties({
        title: 'Work Experience Report',
        subject: 'A detailed list of saved work experiences.',
        author: 'CalcuZen',
    });

    // Header
    const header = (data: any) => {
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.setFont('helvetica', 'normal');
      doc.text("Work Experience Report", data.settings.margin.left, 22);
    };

    // Footer
    const footer = (data: any) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.setTextColor(150);
      const date = new Date().toLocaleDateString();
      doc.text( `Generated on ${date}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
      doc.text( `Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.getWidth() - data.settings.margin.right, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
    };

    autoTable(doc, {
      didDrawPage: (data) => {
          header(data);
          footer(data);
      },
      startY: 30,
      head: [['#', 'Name', 'Years', 'Months', 'Days']],
      body: savedExperiences.map((exp, index) => [
          index + 1,
          exp.name, 
          exp.years, 
          `${exp.months} month${exp.months === 1 ? '' : 's'}`, 
          `${exp.days} day${exp.days === 1 ? '' : 's'}`
      ]),
      headStyles: { 
        fillColor: [24, 96, 53], // Primary color
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      styles: { cellPadding: 3, fontSize: 10, valign: 'middle' },
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 'auto' },
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(12);
    doc.text(`Total Records: ${savedExperiences.length}`, 14, finalY + 15);


    doc.save(`Work_Experience_Report_${new Date().toISOString().split('T')[0]}.pdf`);
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
                <Button variant="outline" size="sm" onClick={downloadPdf} disabled={savedExperiences.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
                <Button variant="outline" size="sm" onClick={clearSavedExperiences} disabled={savedExperiences.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear History
                </Button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {savedExperiences.map((exp) => (
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
