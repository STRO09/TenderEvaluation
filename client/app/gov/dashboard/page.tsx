'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, Area, AreaChart,
} from 'recharts';
import Link from 'next/link';
import { Plus, FileText, CheckCircle, Clock, AlertCircle, TrendingUp, ArrowUpRight } from 'lucide-react';

const dashboardData = {
  stats: [
    {
      label: 'Active Tenders',
      value: 12,
      icon: FileText,
      trend: '+2 this month',
      accent: 'border-t-blue-500',
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
    },
    {
      label: 'Total Submissions',
      value: 89,
      icon: CheckCircle,
      trend: '+14 this month',
      accent: 'border-t-emerald-500',
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50',
    },
    {
      label: 'Pending Review',
      value: 23,
      icon: Clock,
      trend: 'Needs attention',
      accent: 'border-t-amber-500',
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
    },
    {
      label: 'Flagged Issues',
      value: 5,
      icon: AlertCircle,
      trend: 'Requires resolution',
      accent: 'border-t-red-500',
      iconColor: 'text-red-500',
      iconBg: 'bg-red-50',
    },
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
    { status: 'Eligible', count: 45 },
    { status: 'Rejected', count: 28 },
    { status: 'In Review', count: 16 },
  ],
};

const BAR_COLORS: Record<string, string> = {
  Eligible: '#10b981',
  Rejected: '#ef4444',
  'In Review': '#f59e0b',
};

export default function GovernmentDashboard() {
  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
            Overview
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Government Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage tenders and evaluate submissions
          </p>
        </div>
        {/* <Link href="/gov/tenders/create">
          <Button size="default" className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Create Tender
          </Button>
        </Link> */}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardData.stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className={`border-t-2 ${stat.accent} shadow-none hover:shadow-sm transition-shadow`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`p-1.5 rounded-md ${stat.iconBg}`}>
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        {/* Submissions Trend — wider */}
        <Card className="lg:col-span-3 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Submissions Trend</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Monthly submissions vs. evaluations
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-normal">Last 6 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dashboardData.submissionsTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSubmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradEvaluated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="submissions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#gradSubmissions)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="evaluated"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#gradEvaluated)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Eligibility Distribution — narrower */}
        <Card className="lg:col-span-2 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Eligibility Status</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Distribution of submission outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={dashboardData.eligibilityDistribution}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                barSize={36}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="status" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid hsl(var(--border))',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  fill="#3b82f6"
                  // Per-bar color via Cell
                  label={false}
                >
                  {dashboardData.eligibilityDistribution.map((entry) => (
                    <rect key={entry.status} fill={BAR_COLORS[entry.status]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          <CardDescription className="text-xs">Shortcuts to common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Link href="/gov/tenders">
              <Button variant="outline" size="sm" className="gap-1.5 text-sm">
                View All Tenders
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/gov/submissions">
              <Button variant="outline" size="sm" className="gap-1.5 text-sm">
                Review Submissions
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/gov/tenders/create">
              <Button variant="outline" size="sm" className="gap-1.5 text-sm">
                Create New Tender
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}