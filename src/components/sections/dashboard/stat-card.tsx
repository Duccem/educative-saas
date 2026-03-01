"use client";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  index?: number;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-card rounded-xl p-5 flex flex-col gap-3 transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div>
        <span className="text-2xl font-bold font-display text-foreground">{value}</span>
        {trend && (
          <span className={`ml-2 text-xs font-medium ${trend.positive ? "text-success" : "text-destructive"}`}>
            {trend.positive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
    </motion.div>
  );
}

