"use client";
import React, { useState, useEffect } from "react";
import CaseForm from "@/components/staff/CaseForm";
import CaseInbox from "@/components/management/CaseInbox";
import AuthForm from "@/components/auth/AuthForm";
import PollSystem from "@/components/polls/PollSystem";
import Analytics from "@/components/management/Analytics";
import { useAuth } from "@/components/staff/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// 1. Define the dynamic API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const { token, user, logout } = useAuth();
  const [cases, setCases] = useState([]);

  // Fetch cases to be shared between Analytics and CaseInbox
  const fetchAllCases = async () => {
    try {
      // 2. Use dynamic API_URL for fetching cases
      const res = await fetch(`${API_URL}/api/cases`, {
        headers: { "x-auth-token": token || "" }
      });
      const data = await res.json();
      if (res.ok) setCases(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    if (token && user?.role !== "Staff") {
      fetchAllCases();
    }
  }, [token, user]);

  if (!token) {
    return <AuthForm />;
  }

  const role = user?.role || "Staff";

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">NeoConnect</h1>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500 uppercase">{role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>

        {role === "Staff" ? (
          <Tabs defaultValue="submit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
              <TabsTrigger value="hub">Public Hub (Impact Tracking)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="submit">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <CaseForm />
                </div>
                <div>
                  <PollSystem />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hub">
               <div className="bg-white p-6 rounded-lg border">Public Hub Content...</div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Management Dashboard ({role})</h2>
              <Button 
                variant="destructive" 
                onClick={async () => {
                  // 3. Use dynamic API_URL for the escalation check
                  await fetch(`${API_URL}/api/cases/escalate-check`, {
                    method: "POST",
                    headers: { "x-auth-token": token || "" }
                  });
                  alert("Escalation check complete!");
                  fetchAllCases(); 
                }}
              >
                Run Escalation Check
              </Button>
            </div>

            <Analytics cases={cases} /> 

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Live Case Inbox</h3>
              <CaseInbox cases={cases} refreshData={fetchAllCases} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}