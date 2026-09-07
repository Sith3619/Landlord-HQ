import { useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Bell, Lock, User, Loader2, Sun, Moon, Monitor, Palette } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";
import type { ThemePreference } from "../context/ThemeContext";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [fullName, setFullName] = useState("John Landlord");
  const [email, setEmail] = useState("john@example.com");
  const [businessName, setBusinessName] = useState("Landlord HQ Properties");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSave = () => {
    if (!fullName || !email) { toast.error("Please fill in all required fields"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { toast.error("Please enter a valid email address"); return; }
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); toast.success("Settings saved successfully"); }, 1000);
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) { toast.error("Please fill in all password fields"); return; }
    if (newPassword.length < 8) { toast.error("New password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      toast.success("Password updated successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    }, 1000);
  };

  const themeOptions: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
    { value: "light",  label: "Light",  icon: Sun },
    { value: "dark",   label: "Dark",   icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <MainLayout title="Settings">
      <div className="max-w-3xl space-y-8">
        <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>

        {/* Account Information */}
        <Card className="border border-border shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Account Information</CardTitle>
                <CardDescription className="mt-0.5">Update your personal and business details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10" />
              <p className="text-xs text-muted-foreground">This email will be used for account notifications</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business or Landlord Name</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Optional"
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">Appears on documents and communications with tenants</p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border border-border shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted">
                <Palette className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Appearance</CardTitle>
                <CardDescription className="mt-0.5">Choose your preferred color theme</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all",
                    theme === value
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                      : "border-border bg-card text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Password & Security */}
        <Card className="border border-border shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Password &amp; Security</CardTitle>
                <CardDescription className="mt-0.5">Keep your account secure</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword" type="password"
                placeholder="Enter your current password" className="h-10"
                value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword" type="password"
                placeholder="Enter a new password (min. 8 characters)" className="h-10"
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword" type="password"
                placeholder="Re-enter your new password" className="h-10"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <Button variant="outline" className="w-full sm:w-auto" onClick={handlePasswordUpdate} disabled={isUpdatingPassword}>
                {isUpdatingPassword ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>) : "Update Password"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border border-border shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription className="mt-0.5">Manage how you receive updates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Email Notifications", desc: "Receive updates about maintenance tickets and lease renewals" },
              { title: "Maintenance Alerts",  desc: "Get notified when new maintenance tickets are created" },
              { title: "Lease Expiry Reminders", desc: "Alerts when tenant leases are ending soon" },
            ].map(({ title, desc }, i) => (
              <div key={title}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex items-start justify-between py-1">
                  <div className="space-y-1">
                    <p className="font-medium text-sm text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0 ml-4">Configure</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-green-600 hover:bg-green-700 px-8" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : "Save Changes"}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
