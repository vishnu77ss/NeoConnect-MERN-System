"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/staff/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// 1. Define the dynamic API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PollSystem() {
  const { token, user } = useAuth();
  const [poll, setPoll] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  // 1. Fetch the active poll from Backend
  const fetchPoll = async () => {
    try {
      // 2. Use dynamic API_URL here
      const res = await fetch(`${API_URL}/api/polls/active`, {
        headers: { "x-auth-token": token || "" }
      });
      const data = await res.json();
      if (res.ok && data) {
        setPoll(data);
        // Check if current user has already voted
        if (data.votedBy?.includes(user?.id)) setHasVoted(true);
      }
    } catch (err) {
      console.error("Poll fetch error:", err);
    }
  };

  useEffect(() => { 
    if (token) fetchPoll(); 
  }, [token]);

  // 2. Submit Vote to Backend
  const handleVote = async () => {
    if (!selectedOption) return alert("Select an option first!");
    try {
      // 3. Use dynamic API_URL here
      const res = await fetch(`${API_URL}/api/polls/vote/${poll._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "x-auth-token": token || "" 
        },
        body: JSON.stringify({ optionId: selectedOption }),
      });
      if (res.ok) {
        setHasVoted(true);
        fetchPoll(); // Refresh results
      }
    } catch (err) {
      console.error("Vote error:", err);
    }
  };

  if (!poll) return <div className="text-center p-4">No active polls at the moment.</div>;

  const totalVotes = poll.options.reduce((acc: number, opt: any) => acc + opt.votes, 0);

  return (
    <Card className="max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasVoted ? (
          <div className="space-y-4">
            <RadioGroup onValueChange={setSelectedOption}>
              {poll.options.map((opt: any) => (
                <div key={opt._id} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt._id} id={opt._id} />
                  <Label htmlFor={opt._id}>{opt.text}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button className="w-full" onClick={handleVote}>Submit Vote</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {poll.options.map((opt: any) => {
              const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
              return (
                <div key={opt._id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{opt.text}</span>
                    <span>{percentage}%</span>
                  </div>
                  <Progress value={percentage} />
                </div>
              );
            })}
            <p className="text-center text-xs text-slate-500">Your vote has been recorded.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}