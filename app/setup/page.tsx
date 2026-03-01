'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Copy } from 'lucide-react';

const sqlScript = `-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  sku VARCHAR(100) UNIQUE NOT NULL,
  weight DECIMAL(8, 2),
  stock INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  image_url TEXT,
  images JSONB DEFAULT '[]'::JSONB,
  variants JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional tables...
-- (See DATABASE_SETUP.md for complete script)`;

export default function SetupPage() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold mb-4">PakMart Setup</h1>
          <p className="text-lg text-muted-foreground">
            Get your e-commerce platform ready in just a few steps
          </p>
        </div>

        {/* Setup Instructions */}
        <div className="grid gap-6">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
                      1
                    </span>
                    Access Supabase Dashboard
                  </CardTitle>
                  <CardDescription>Open your Supabase project</CardDescription>
                </div>
                <CheckCircle2 className="text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Go to{' '}
                <a
                  href="https://app.supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  app.supabase.com
                </a>{' '}
                and select your PakMart project
              </p>
              <p className="text-sm text-muted-foreground">
                You should see your project already connected in the v0 UI Vars section
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
                      2
                    </span>
                    Create Database Tables
                  </CardTitle>
                  <CardDescription>Execute the SQL migration script</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="font-semibold">a)</span>
                  <span>In Supabase, click on "SQL Editor" in the left sidebar</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">b)</span>
                  <span>Click "New Query"</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">c)</span>
                  <span>Paste the SQL script below</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">d)</span>
                  <span>Click "Run" to execute the script</span>
                </li>
              </ol>

              <div className="mt-6 space-y-3">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>View Full Script</AlertTitle>
                  <AlertDescription>
                    The complete database setup script is available in <code className="bg-muted px-2 py-1 rounded">DATABASE_SETUP.md</code> in the project root
                  </AlertDescription>
                </Alert>

                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre className="text-xs">{sqlScript}</pre>
                </div>

                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? 'Copied!' : 'Copy SQL Script'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
                      3
                    </span>
                    Enable Row Level Security
                  </CardTitle>
                  <CardDescription>Protect your data with RLS policies</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                After creating tables, enable RLS and set up policies. The complete RLS setup is included in{' '}
                <code className="bg-muted px-2 py-1 rounded">DATABASE_SETUP.md</code>
              </p>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  RLS ensures users can only access their own data (orders, addresses, cart, etc.)
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
                      4
                    </span>
                    Verify & Add Sample Data
                  </CardTitle>
                  <CardDescription>Test your setup with sample products</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Once tables are created, use the SQL Editor to insert sample categories and products (see DATABASE_SETUP.md for sample data)
              </p>
              <p className="text-sm text-muted-foreground">
                After that, refresh your browser and you'll see the homepage populate with your data!
              </p>
            </CardContent>
          </Card>

          {/* Success Alert */}
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900">Ready to Start</AlertTitle>
            <AlertDescription className="text-green-800">
              Your PakMart application is ready. Follow the steps above to complete the database setup.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button asChild className="flex-1">
              <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer">
                Open Supabase Dashboard
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-3">What's Included</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>11 database tables (products, orders, cart, users, etc.)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Row Level Security (RLS) policies for data protection</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Payment methods (COD, JazzCash, EasyPaisa, Card)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Complete e-commerce functionality for Pakistan market</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Admin dashboard and inventory management</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
