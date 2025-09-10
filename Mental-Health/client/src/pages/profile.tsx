import { useState } from "react";
import { User, Settings, Bell, Shield, Languages, Palette, Download, Save, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAppContext, type ThemeType } from "@/context/AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BackButton } from "@/components/ui/back-button";

export default function Profile() {
  const { currentUser, setCurrentUser, theme, setTheme, toggleTheme } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    institution: currentUser?.institution || "",
    course: currentUser?.course || "",
    year: currentUser?.year || 1,
    bio: "",
    language: currentUser?.language || "en",
  });

  const [notifications, setNotifications] = useState({
    appointmentReminders: true,
    screeningReminders: true,
    communityUpdates: false,
    crisisAlerts: true,
    weeklyReports: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "private",
    shareScreeningData: false,
    allowDirectMessages: true,
    showOnlineStatus: false,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("PATCH", `/api/users/${currentUser?.id}`, data);
    },
    onSuccess: (response) => {
      if (currentUser) {
        setCurrentUser({ ...currentUser, ...formData });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update notification preferences
  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: typeof notifications) => {
      return await apiRequest("PATCH", `/api/users/${currentUser?.id}/notifications`, data);
    },
    onSuccess: () => {
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update notification preferences.",
        variant: "destructive",
      });
    },
  });

  // Update privacy settings
  const updatePrivacyMutation = useMutation({
    mutationFn: async (data: typeof privacy) => {
      return await apiRequest("PATCH", `/api/users/${currentUser?.id}/privacy`, data);
    },
    onSuccess: () => {
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update privacy settings.",
        variant: "destructive",
      });
    },
  });

  // Export user data
  const exportDataMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("GET", `/api/users/${currentUser?.id}/export`, {});
    },
    onSuccess: (response) => {
      // Create download link
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mental-health-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been downloaded successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: string, value: any) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleSaveNotifications = () => {
    updateNotificationsMutation.mutate(notifications);
  };

  const handleSavePrivacy = () => {
    updatePrivacyMutation.mutate(privacy);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile & Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, privacy preferences, and notification options.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" data-testid="tab-profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" data-testid="tab-privacy">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="preferences" data-testid="tab-preferences">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground text-xl font-medium">
                    {formData.firstName?.[0]}{formData.lastName?.[0]}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    data-testid="input-first-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  data-testid="input-email"
                />
              </div>

              {/* Academic Information */}
              <Separator />
              <h3 className="text-lg font-medium">Academic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => handleInputChange("institution", e.target.value)}
                  data-testid="input-institution"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course/Major</Label>
                  <Input
                    id="course"
                    value={formData.course}
                    onChange={(e) => handleInputChange("course", e.target.value)}
                    data-testid="input-course"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year of Study</Label>
                  <Select value={formData.year.toString()} onValueChange={(value) => handleInputChange("year", parseInt(value))}>
                    <SelectTrigger data-testid="select-year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                      <SelectItem value="5">5th Year</SelectItem>
                      <SelectItem value="6">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  data-testid="textarea-bio"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  data-testid="button-save-profile"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about upcoming counseling sessions
                    </p>
                  </div>
                  <Switch
                    checked={notifications.appointmentReminders}
                    onCheckedChange={(checked) => handleNotificationChange("appointmentReminders", checked)}
                    data-testid="switch-appointment-reminders"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Screening Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Periodic reminders to take mental health assessments
                    </p>
                  </div>
                  <Switch
                    checked={notifications.screeningReminders}
                    onCheckedChange={(checked) => handleNotificationChange("screeningReminders", checked)}
                    data-testid="switch-screening-reminders"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Community Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications about new posts and replies in forums you follow
                    </p>
                  </div>
                  <Switch
                    checked={notifications.communityUpdates}
                    onCheckedChange={(checked) => handleNotificationChange("communityUpdates", checked)}
                    data-testid="switch-community-updates"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Crisis Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important notifications about crisis resources and emergency support
                    </p>
                  </div>
                  <Switch
                    checked={notifications.crisisAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("crisisAlerts", checked)}
                    data-testid="switch-crisis-alerts"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Weekly summary of your mental health journey and insights
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                    data-testid="switch-weekly-reports"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={updateNotificationsMutation.isPending}
                  data-testid="button-save-notifications"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateNotificationsMutation.isPending ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select value={privacy.profileVisibility} onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}>
                    <SelectTrigger data-testid="select-profile-visibility">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private - Only visible to me</SelectItem>
                      <SelectItem value="institution">Institution - Visible to students from my institution</SelectItem>
                      <SelectItem value="public">Public - Visible to all users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Share Screening Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous contribution of screening results for research (no personal data shared)
                    </p>
                  </div>
                  <Switch
                    checked={privacy.shareScreeningData}
                    onCheckedChange={(checked) => handlePrivacyChange("shareScreeningData", checked)}
                    data-testid="switch-share-screening-data"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow other users to send you private messages
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowDirectMessages}
                    onCheckedChange={(checked) => handlePrivacyChange("allowDirectMessages", checked)}
                    data-testid="switch-allow-direct-messages"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Online Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others see when you're active on the platform
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showOnlineStatus}
                    onCheckedChange={(checked) => handlePrivacyChange("showOnlineStatus", checked)}
                    data-testid="switch-show-online-status"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSavePrivacy}
                  disabled={updatePrivacyMutation.isPending}
                  data-testid="button-save-privacy"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updatePrivacyMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="space-y-6">
            {/* Theme & Language */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Appearance & Language
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Color Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose a color theme that feels comfortable and calming for you
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {([
                      { value: "light", label: "Light", colors: ["#ffffff", "#f1f5f9", "#10b981", "#6366f1"] },
                      { value: "dark", label: "Dark", colors: ["#0f172a", "#1e293b", "#10b981", "#6366f1"] },
                      { value: "ocean", label: "Ocean Breeze", colors: ["#0c1620", "#1a2b3d", "#40e0d0", "#0891b2"] },
                      { value: "sunset", label: "Sunset Warm", colors: ["#1a0f0a", "#2d1b17", "#ff8c42", "#ec4899"] },
                      { value: "forest", label: "Forest Calm", colors: ["#0a140a", "#162016", "#22c55e", "#65a30d"] },
                      { value: "lavender", label: "Lavender Dreams", colors: ["#1a0f1a", "#2d1b2d", "#a855f7", "#c084fc"] },
                      { value: "cosmic", label: "Cosmic Space", colors: ["#0c0a1a", "#1a162d", "#d946ef", "#3b82f6"] }
                    ] as const).map((themeOption) => (
                      <button
                        key={themeOption.value}
                        onClick={() => setTheme(themeOption.value as ThemeType)}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                          theme === themeOption.value 
                            ? 'border-primary shadow-md' 
                            : 'border-border hover:border-muted-foreground'
                        }`}
                        data-testid={`theme-${themeOption.value}`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="grid grid-cols-2 gap-1 w-8 h-8">
                            {themeOption.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-3 h-3 rounded-sm"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium">{themeOption.label}</p>
                          </div>
                        </div>
                        {theme === themeOption.value && (
                          <div className="text-xs text-primary font-medium">✓ Active</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                    <SelectTrigger data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Data Export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Data Export
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Download a copy of your data including screening results, chat history, and profile information.
                    This data is provided in JSON format for your records.
                  </p>
                  <Button
                    onClick={() => exportDataMutation.mutate()}
                    disabled={exportDataMutation.isPending}
                    variant="outline"
                    data-testid="button-export-data"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {exportDataMutation.isPending ? "Preparing Download..." : "Download My Data"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">Active</Badge>
                  <span className="text-sm text-muted-foreground">
                    Member since {new Date().toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}