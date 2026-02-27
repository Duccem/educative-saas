"use client";
import { Languages, Laptop, Moon, Save, Sun, SunMoon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

export const Preferences = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Card>
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Manage your preferences</CardDescription>
        </div>
        <Button type="submit">
          <Save /> {"Save Changes"}
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg border flex items-center justify-center p-2">
              <Languages className="size-4" />
            </div>
            <Label>Language Preference</Label>
          </div>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select the language system" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg border flex items-center justify-center p-2">
              <SunMoon className="size-4" />
            </div>
            <Label>Theme Preference</Label>
          </div>
          <Select
            value={theme ?? "system"}
            onValueChange={(value) => setTheme(value ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select the theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                {" "}
                <Sun /> Light
              </SelectItem>
              <SelectItem value="dark">
                {" "}
                <Moon /> Dark
              </SelectItem>
              <SelectItem value="system">
                {" "}
                <Laptop /> System
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
