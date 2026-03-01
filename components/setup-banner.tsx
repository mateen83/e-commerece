'use client';

import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SetupBanner() {
  return (
    <Alert className="bg-blue-50 border-blue-200 mb-8">
      <AlertCircle className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-900">Database Setup Required</AlertTitle>
      <AlertDescription className="text-blue-800 mt-2">
        <p className="mb-4">
          Your PakMart application is ready! To start accepting orders, you need to set up your database tables in Supabase.
        </p>
        <Button asChild size="sm" variant="outline" className="gap-2">
          <Link href="/setup">
            View Setup Instructions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
