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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-white">
        <Card className="w-full max-w-md border border-slate-200/60 shadow-xl backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="relative w-32 h-24">
                <Image
                  src="/butane-logo-official.jpeg"
                  alt="Butane Energy Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Butane Energy ERP
              </CardTitle>
              <p className="text-sm text-muted-foreground font-medium">RC 423007</p>
              <CardDescription className="text-base">
                Sign in to access your account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@butanenergy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-slate-300 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-slate-300 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <div className="flex-1 border-t border-slate-300"></div>
                <div className="px-4 text-sm font-medium text-slate-500">Demo Access</div>
                <div className="flex-1 border-t border-slate-300"></div>
              </div>
              <div className="bg-slate-50/50 rounded-lg p-4 space-y-3">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700">Quick Demo Login</p>
                  <p className="text-xs text-slate-500 mt-1">Password: demo123</p>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <div
                    className="p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    onClick={() => setEmail('musa.garba@butane-energy.com')}
                  >
                    <p className="font-medium text-sm text-slate-900">Executive (Full Access)</p>
                    <p className="text-xs text-slate-500">musa.garba@butane-energy.com</p>
                  </div>
                  <div
                    className="p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    onClick={() => setEmail('ahmed.mohammed@butane-energy.com')}
                  >
                    <p className="font-medium text-sm text-slate-900">Operations Manager (Kano Plant)</p>
                    <p className="text-xs text-slate-500">ahmed.mohammed@butane-energy.com</p>
                  </div>
                  <div
                    className="p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    onClick={() => setEmail('emeka.okafor@butane-energy.com')}
                  >
                    <p className="font-medium text-sm text-slate-900">Finance Department Head</p>
                    <p className="text-xs text-slate-500">emeka.okafor@butane-energy.com</p>
                  </div>
                  <div
                    className="p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    onClick={() => setEmail('grace.adebayo@butane-energy.com')}
                  >
                    <p className="font-medium text-sm text-slate-900">Procurement Head</p>
                    <p className="text-xs text-slate-500">grace.adebayo@butane-energy.com</p>
                  </div>
                  <div
                    className="p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    onClick={() => setEmail('fatima.aliyu@butane-energy.com')}
                  >
                    <p className="font-medium text-sm text-slate-900">Trading Department</p>
                    <p className="text-xs text-slate-500">fatima.aliyu@butane-energy.com</p>
                  </div>
                  <div
                    className="p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    onClick={() => setEmail('ibrahim.usman@butane-energy.com')}
                  >
                    <p className="font-medium text-sm text-slate-900">Logistics Head</p>
                    <p className="text-xs text-slate-500">ibrahim.usman@butane-energy.com</p>
                  </div>
                  <div
                    className="p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    onClick={() => setEmail('khadija.yusuf@butane-energy.com')}
                  >
                    <p className="font-medium text-sm text-slate-900">HR Department Head</p>
                    <p className="text-xs text-slate-500">khadija.yusuf@butane-energy.com</p>
                  </div>
                  <div
                    className="p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    onClick={() => setEmail('aisha.ibrahim@butane-energy.com')}
                  >
                    <p className="font-medium text-sm text-slate-900">Sales Representative</p>
                    <p className="text-xs text-slate-500">aisha.ibrahim@butane-energy.com</p>
                  </div>
                </div>
                <p className="text-xs text-center text-slate-500 pt-2 border-t border-slate-200">
                  Click any user to auto-fill email
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/10 to-blue-600/10">
        <Image
          src="/butane1.png"
          alt="Butane Energy"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Butane Energy Limited
              </h1>
              <p className="text-sm font-medium text-blue-200/80">RC 423007</p>
            </div>
            <p className="text-lg text-white/95 leading-relaxed max-w-md">
              Deepening the usage of clean energy, preserving the environment and
              creating wealth
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/80">Energy Solutions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-white/80">Environmental Care</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
