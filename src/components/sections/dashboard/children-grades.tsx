"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { children } from "./children";

export interface ChildGrade {
  subject: string;
  grade: number;
  letter: string;
  trend: "up" | "down" | "stable";
}

export const childGrades: Record<string, ChildGrade[]> = {
  "1": [
    { subject: "Algebra I", grade: 92, letter: "A-", trend: "up" },
    { subject: "Biology", grade: 88, letter: "B+", trend: "stable" },
    { subject: "English Literature", grade: 95, letter: "A", trend: "up" },
    { subject: "Spanish", grade: 85, letter: "B", trend: "down" },
    { subject: "Physical Education", grade: 98, letter: "A+", trend: "stable" },
  ],
  "2": [
    { subject: "Algebra I", grade: 78, letter: "C+", trend: "up" },
    { subject: "Chemistry", grade: 82, letter: "B-", trend: "stable" },
    { subject: "Creative Writing", grade: 90, letter: "A-", trend: "up" },
    { subject: "Spanish", grade: 75, letter: "C", trend: "down" },
    { subject: "Physical Education", grade: 95, letter: "A", trend: "stable" },
  ],
};

const trendIcon = (t: "up" | "down" | "stable") => {
  if (t === "up") return <TrendingUp className="h-3 w-3 text-success" />;
  if (t === "down") return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

export function ChildrenGrades() {
  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Academic Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={children[0]?.id}>
          <TabsList className="mb-4">
            {children.map((child) => (
              <TabsTrigger key={child.id} value={child.id}>
                {child.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          {children.map((child) => (
            <TabsContent key={child.id} value={child.id}>
              <div className="space-y-2">
                {(childGrades[child.id] || []).map((g, i) => (
                  <motion.div
                    key={g.subject}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
                  >
                    <span className="text-sm font-medium text-foreground">{g.subject}</span>
                    <div className="flex items-center gap-3">
                      {trendIcon(g.trend)}
                      <Badge variant="outline" className="font-mono min-w-[40px] justify-center">
                        {g.letter}
                      </Badge>
                      <span className="text-sm font-bold text-foreground w-8 text-right">{g.grade}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

