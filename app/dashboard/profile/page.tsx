"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import * as Icons from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { designSystem } from "@/lib/design-system";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleAvatarSave = async () => {
    if (!avatarFile) return;

    setIsLoading(true);
    try {
      // Simulate API call for avatar upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      });

      // Reset avatar upload state
      setAvatarFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return "UN";
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Icons.Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
    <div className={designSystem.getPageLayout('detail')}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={designSystem.getHeading('h1')}>My Profile</h1>
          <p className={designSystem.getBody('medium')}>
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="account">Account Info</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Avatar Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Upload a new avatar for your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AvatarUpload
                  currentImage={user.profileImage}
                  fallback={getUserInitials()}
                  onImageChange={(file) => setAvatarFile(file)}
                  onImageSave={handleAvatarSave}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>

            {/* Profile Details Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          firstName: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          lastName: e.target.value
                        }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Icons.Save className="mr-2 h-4 w-4" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Icons.Key className="mr-2 h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Information</CardTitle>
              <CardDescription>
                Important security details about your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Last Password Change</p>
                  <p className="text-sm text-muted-foreground">Never changed</p>
                </div>
                <Badge variant="outline">Good</Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Account Status</p>
                  <p className="text-sm text-muted-foreground">Your account is active and secure</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Info Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                View your account information and access details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Employee ID</Label>
                    <p className="text-sm font-mono">{user.employeeId}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                    <p className="text-sm">{user.department?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                    <Badge variant="outline">
                      {user.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Account Created</Label>
                    <p className="text-sm">{formatDate(user.createdAt)}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Last Login</Label>
                    <p className="text-sm">
                      {user.lastLogin ? formatDate(user.lastLogin) : "Not recorded"}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
                    <Badge className={user.isActive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Permissions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.permissions?.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>

              {user.plantAccess && user.plantAccess.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Plant Access</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.plantAccess.map((plant) => (
                      <Badge key={plant} variant="outline" className="text-xs">
                        {plant}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
}