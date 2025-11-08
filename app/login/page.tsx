"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password. Please check your credentials.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-foreground">
                  BE
                </span>
              </div>
            </div>
            <CardTitle className="text-2xl">Butane Energy ERP</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@butanenergy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 space-y-3">
              <div className="text-center text-sm text-muted-foreground">
                <p className="font-medium">Demo Users (Password: demo123)</p>
              </div>
              <div className="space-y-2 text-xs">
                <div
                  className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setEmail('musa.garba@butane-energy.com')}
                >
                  <p className="font-medium">Executive (Full Access)</p>
                  <p className="text-muted-foreground">musa.garba@butane-energy.com</p>
                </div>
                <div
                  className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setEmail('ahmed.mohammed@butane-energy.com')}
                >
                  <p className="font-medium">Operations Manager (Kano Plant)</p>
                  <p className="text-muted-foreground">ahmed.mohammed@butane-energy.com</p>
                </div>
                <div
                  className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setEmail('emeka.okafor@butane-energy.com')}
                >
                  <p className="font-medium">Finance Department Head</p>
                  <p className="text-muted-foreground">emeka.okafor@butane-energy.com</p>
                </div>
                <div
                  className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setEmail('grace.adebayo@butane-energy.com')}
                >
                  <p className="font-medium">Procurement Head</p>
                  <p className="text-muted-foreground">grace.adebayo@butane-energy.com</p>
                </div>
                <div
                  className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setEmail('fatima.aliyu@butane-energy.com')}
                >
                  <p className="font-medium">Trading Department</p>
                  <p className="text-muted-foreground">fatima.aliyu@butane-energy.com</p>
                </div>
                <div
                  className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setEmail('ibrahim.usman@butane-energy.com')}
                >
                  <p className="font-medium">Logistics Head</p>
                  <p className="text-muted-foreground">ibrahim.usman@butane-energy.com</p>
                </div>
                <div
                  className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setEmail('khadija.yusuf@butane-energy.com')}
                >
                  <p className="font-medium">HR Department Head</p>
                  <p className="text-muted-foreground">khadija.yusuf@butane-energy.com</p>
                </div>
                <div
                  className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setEmail('aisha.ibrahim@butane-energy.com')}
                >
                  <p className="font-medium">Sales Representative</p>
                  <p className="text-muted-foreground">aisha.ibrahim@butane-energy.com</p>
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">Click any user to auto-fill email</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary/5">
        <Image
          src="/butane1.png"
          alt="Butane Energy"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-50 left-0 right-0 p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Butane Energy Limited</h1>
          <p className="text-lg text-white/90">
            Deepening the usage of clean energy, preserving the environment and
            creating wealth
          </p>
        </div>
      </div>
    </div>
  );
}
