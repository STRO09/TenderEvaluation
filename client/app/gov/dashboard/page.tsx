'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Link from 'next/link';
import { Plus, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const dashboardData = {
  stats: [
    { label: 'Active Tenders', value: 12, icon: FileText, color: 'text-blue-600' },
    { label: 'Total Submissions', value: 89, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Pending Review', value: 23, icon: Clock, color: 'text-yellow-600' },
    { label: 'Flagged Issues', value: 5, icon: AlertCircle, color: 'text-red-600' },
  ],
  submissionsTrend: [
    { month: 'Jan', submissions: 24, evaluated: 12 },
    { month: 'Feb', submissions: 34, evaluated: 18 },
    { month: 'Mar', submissions: 42, evaluated: 28 },
    { month: 'Apr', submissions: 38, evaluated: 32 },
    { month: 'May', submissions: 51, evaluated: 45 },
    { month: 'Jun', submissions: 61, evaluated: 58 },
  ],
  eligibilityDistribution: [
    { status: 'Eligible', count: 45, fill: 'var(--status-eligible)' },
    { status: 'Rejected', count: 28, fill: 'var(--status-rejected)' },
    { status: 'Review', count: 16, fill: 'var(--status-review)' },
  ],
};

export default function GovernmentDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Government Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage tenders and evaluate submissions</p>
        </div>
        <Link href="/gov/tenders/create">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Tender
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Submissions Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions Trend</CardTitle>
            <CardDescription>Monthly submissions and evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.submissionsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="submissions" stroke="var(--chart-1)" />
                <Line type="monotone" dataKey="evaluated" stroke="var(--chart-2)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Eligibility Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Eligibility Status</CardTitle>
            <CardDescription>Distribution of submission statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.eligibilityDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="var(--chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/gov/tenders">
              <Button variant="outline">View All Tenders</Button>
            </Link>
            <Link href="/gov/submissions">
              <Button variant="outline">Review Submissions</Button>
            </Link>
            <Link href="/gov/tenders/create">
              <Button variant="outline">Create New Tender</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
