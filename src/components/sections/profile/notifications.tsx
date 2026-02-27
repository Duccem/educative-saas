import { Bell, Mail, MessageSquare, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Notifications = () => {
  return (
    <Card>
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </div>
        <Button type="button">
          <Save /> {"Save Changes"}
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="size-4" />
            <p className="font-light">Email</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="size-4" />
            <p className="font-light">Push</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4" />
            <p className="font-light">In App</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4" />
            <p className="font-light">SMS</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};

