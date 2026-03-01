'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { signOut } from '@/lib/services/auth';
import { User, MapPin, Heart, LogOut, ShoppingBag, Activity } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

export default function AccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoading(false);
    }
  };

  // --- REALTIME SUBSCRIPTION EXAMPLE ---
  const [realtimeEvents, setRealtimeEvents] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();

    // Listen to changes in the "orders" table
    const ordersSubscription = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Realtime Order Update Received!', payload);
          setRealtimeEvents((prev) => [payload, ...prev]);
        }
      )
      .subscribe((status) => {
        console.log('Supabase Realtime Status:', status);
      });

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, []);
  // ------------------------------------

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-muted-foreground mt-2">Manage your profile and orders</p>
            </div>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="outline"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              {isLoading ? 'Logging out...' : 'Logout'}
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="gap-2">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Address</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Wishlist</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Loading profile information...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    Order History
                    {/* Realtime Indicator */}
                    <span className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Activity className="w-3 h-3 animate-pulse" />
                      Realtime Active
                    </span>
                  </CardTitle>
                  <CardDescription>Track your previous orders and watch for live updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {realtimeEvents.length > 0 && (
                    <div className="mb-4 space-y-2 max-h-[200px] overflow-y-auto">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Updates</p>
                      {realtimeEvents.map((event, i) => (
                        <div key={i} className="text-sm p-3 bg-blue-50 text-blue-900 rounded-md border border-blue-100 flex justify-between">
                          <span>
                            <strong>{event.eventType}</strong> on order #{event.new?.order_number || event.old?.id}
                          </span>
                          <span className="text-xs opacity-75">Just now</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Fetching past orders...</p>
                    <Button asChild className="mt-4">
                      <Link href="/products">Continue Shopping</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Addresses</CardTitle>
                  <CardDescription>Manage your delivery addresses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">No addresses saved yet</p>
                    <Button asChild className="mt-4">
                      <Link href="/account/addresses">Add Address</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Wishlist</CardTitle>
                  <CardDescription>Products you want to buy later</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Your wishlist is empty</p>
                    <Button asChild className="mt-4">
                      <Link href="/products">Browse Products</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
