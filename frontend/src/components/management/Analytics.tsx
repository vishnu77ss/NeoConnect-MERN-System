"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Analytics({ cases }: { cases: any[] }) {
  // Logic to count cases per department
  const dataMap = cases.reduce((acc: any, curr: any) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(dataMap).map(dept => ({
    name: dept,
    count: dataMap[dept]
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Cases by Department</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count">
                {chartData.map((entry, index) => (
                  // Section 4.4 Rule: Highlight Hotspots in Red (count >= 5)
                  <Cell key={`cell-${index}`} fill={entry.count >= 5 ? "#ef4444" : "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Hotspots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.filter(d => d.count >= 5).length > 0 ? (
              chartData.filter(d => d.count >= 5).map(d => (
                <div key={d.name} className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
                  ⚠️ {d.name} Department requires immediate attention ({d.count} cases)
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic">No hotspots detected currently.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}