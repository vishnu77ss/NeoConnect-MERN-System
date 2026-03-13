"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/staff/context/AuthContext";

// 1. Define the dynamic API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CaseInboxProps {
  cases: any[];
  refreshData: () => void;
}

export default function CaseInbox({ cases, refreshData }: CaseInboxProps) {
  const { token } = useAuth();

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      // 2. Use the dynamic API_URL variable here
      const res = await fetch(`${API_URL}/api/cases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || ""
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        alert("Status Updated Successfully!");
        refreshData();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                No cases found in the database.
              </TableCell>
            </TableRow>
          ) : (
            cases.map((c: any) => (
              <TableRow key={c._id}>
                <TableCell className="font-medium">{c.trackingId}</TableCell>
                <TableCell>{c.title}</TableCell>
                
                <TableCell>
                  {c.isAnonymous ? (
                    <span className="text-slate-400 italic font-normal">Anonymous</span>
                  ) : (
                    c.submittedBy?.name || "Staff"
                  )}
                </TableCell>

                <TableCell>
                  <Badge variant={c.severity === "High" ? "destructive" : "secondary"}>
                    {c.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={c.status === "Escalated" ? "destructive" : "outline"}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">Manage</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Case: {c.trackingId}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Set New Status</Label>
                          <Select onValueChange={(val) => updateStatus(c._id, val)}>
                            <SelectTrigger>
                              <SelectValue placeholder={c.status} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Assigned">Assigned</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                              <SelectItem value="Escalated">Escalated</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}