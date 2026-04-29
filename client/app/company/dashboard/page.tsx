'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Search, Bell, TrendingUp, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfidenceIndicator } from '@/components/common/ConfidenceIndicator';

const dashboardData = {
  stats: [
    { label: 'Active Submissions', value: 3, icon: FileText, color: 'text-blue-600' },
    { label: 'Eligible', value: 2, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Needs Review', value: 1, icon: Clock, color: 'text-yellow-600' },
    { label: 'Rejected', value: 0, icon: AlertCircle, color: 'text-red-600' },
  ],
  recentNotifications: [
    {
      id: 1,
      type: 'status_change',
      title: 'Tender XYZ: Status Updated',
      message: 'Your submission has moved to review stage',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'missing_document',
      title: 'Missing Document Required',
      message: 'GST certificate needed for Tender ABC',
      time: '1 day ago',
      read: false,
    },
    {
      id: 3,
      type: 'deadline_approaching',
      title: 'Deadline Approaching',
      message: 'Tender DEF deadline in 3 days',
      time: '2 days ago',
      read: true,
    },
  ],
  recentSubmissions: [
    {
      id: 1,
      tender: 'Infrastructure Project 2024',
      status: 'eligible',
      confidence: 92,
      lastUpdated: '2024-06-15',
    },
    {
      id: 2,
      tender: 'IT Services Procurement',
      status: 'review',
      confidence: 78,
      lastUpdated: '2024-06-14',
    },
    {
      id: 3,
      tender: 'Construction & Design',
      status: 'eligible',
      confidence: 85,
      lastUpdated: '2024-06-12',
    },
  ],
};

export default function CompanyDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Company Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your submissions and explore new tenders</p>
        </div>
        <Link href="/company/explore">
          <Button size="lg">
            <Search className="mr-2 h-4 w-4" />
            Explore Tenders
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
                <p className="text-xs text-muted-foreground mt-1">Current</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="submissions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Recent Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Submissions</CardTitle>
              <CardDescription>Track your active tender submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentSubmissions.length > 0 ? (
                  dashboardData.recentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{submission.tender}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Last updated: {submission.lastUpdated}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end gap-2">
                          <StatusBadge status={submission.status} />
                          <ConfidenceIndicator confidence={submission.confidence} size="sm" />
                        </div>
                        <Link href={`/submissions/${submission.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No submissions yet</p>
                )}
              </div>
              <div className="mt-6">
                <Link href="/company/submissions">
                  <Button variant="outline" className="w-full">
                    View All Submissions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Status updates and important messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.recentNotifications.length > 0 ? (
                  dashboardData.recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg ${
                        notification.read ? 'bg-background border-border' : 'bg-status-review-bg border-status-review'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                        </div>
                        {!notification.read && <div className="w-2 h-2 rounded-full bg-status-review ml-4 mt-1" />}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No notifications</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
