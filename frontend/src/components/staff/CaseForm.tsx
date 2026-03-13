"use client";
import React, { useState } from "react";
import { useAuth } from "@/components/staff/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 1. Define the dynamic API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CaseForm() {
  const { token } = useAuth(); 
  const [submitted, setSubmitted] = useState(false);
  const [successId, setSuccessId] = useState(""); 
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    department: "General",
    location: "Main Office",
    severity: "Medium",
    isAnonymous: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 2. Use the dynamic API_URL variable here
      const response = await fetch(`${API_URL}/api/cases`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-auth-token": token || "" 
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessId(data.trackingId); 
        setSubmitted(true);
      } else {
        alert(data.msg || "Submission failed. Make sure you are logged in as Staff.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the backend server.");
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto mt-10 p-10 text-center">
        <h2 className="text-2xl font-bold text-green-600">Submission Successful!</h2>
        <p className="mt-4 text-slate-600">Your tracking ID is: <strong>{successId}</strong></p>
        <Button className="mt-6" onClick={() => {
          setSubmitted(false);
          setSuccessId("");
        }}>
          Submit Another
        </Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Submit Feedback or Complaint</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Subject / Title</Label>
            <Input 
              id="title" 
              placeholder="Brief summary of the issue" 
              required 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Facilities">Facilities</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select defaultValue="Medium" onValueChange={(v) => setFormData({...formData, severity: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea 
              id="desc" 
              placeholder="Detailed explanation..." 
              required 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div className="flex items-center space-x-2 py-4">
            <Switch 
              id="anon" 
              onCheckedChange={(checked) => setFormData({...formData, isAnonymous: checked})} 
            />
            <Label htmlFor="anon">Submit Anonymously</Label>
          </div>

          <Button type="submit" className="w-full">Submit Report</Button>
        </form>
      </CardContent>
    </Card>
  );
}