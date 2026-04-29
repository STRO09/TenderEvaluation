'use client';

import { useRouter } from 'next/navigation';
import { useRole } from '@/lib/role-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthPage() {
  const router = useRouter();
  const { setRole } = useRole();

  const handleRoleSelect = (role: 'government' | 'company') => {
    setRole(role);
    if (role === 'government') {
      router.push('/gov/dashboard');
    } else {
      router.push('/company/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Procurement Platform</h1>
          <p className="text-muted-foreground text-lg">
            Select your role to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Government Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-2xl">Government Officer</CardTitle>
              <CardDescription>
                Create tenders and evaluate submissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Create and manage tenders</p>
                <p>• Set eligibility criteria</p>
                <p>• Evaluate company submissions</p>
                <p>• Review extracted data</p>
                <p>• Make final decisions</p>
              </div>
              <Button
                onClick={() => handleRoleSelect('government')}
                className="w-full"
                size="lg"
              >
                Continue as Government Officer
              </Button>
            </CardContent>
          </Card>

          {/* Company Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-2xl">Company / Bidder</CardTitle>
              <CardDescription>
                Discover tenders and submit applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Explore available tenders</p>
                <p>• Check eligibility requirements</p>
                <p>• Submit documents</p>
                <p>• Track submission status</p>
                <p>• View evaluation results</p>
              </div>
              <Button
                onClick={() => handleRoleSelect('company')}
                className="w-full"
                size="lg"
                variant="outline"
              >
                Continue as Company / Bidder
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Demo Mode: Select a role to explore the platform</p>
        </div>
      </div>
    </div>
  );
}
