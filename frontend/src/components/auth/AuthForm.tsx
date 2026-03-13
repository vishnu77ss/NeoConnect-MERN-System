"use client";
import React, { useState } from "react";
import { useAuth } from "@/components/staff/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// 1. Define the dynamic API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "", 
    email: "", 
    password: "", 
    department: "General", 
    role: "Staff"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    
    try {
      // 2. Use the dynamic API_URL variable here
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        if (isLogin) {
          login(data.token, data.user);
          alert("Logged in successfully!");
        } else {
          alert("Registered! Now please log in.");
          setIsLogin(true);
        }
      } else {
        alert(data.msg || "Something went wrong");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Could not connect to the authentication server.");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle>{isLogin ? "Login to NeoConnect" : "Create Account"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                placeholder="John Doe" 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              type="email" 
              placeholder="email@srmap.edu.in" 
              required 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input 
              type="password" 
              required 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          <Button type="submit" className="w-full">{isLogin ? "Login" : "Register"}</Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Need an account? Register" : "Have an account? Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}