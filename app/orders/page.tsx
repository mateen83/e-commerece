'use client';

import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ChevronRight } from 'lucide-react';

// Sample orders data
const sampleOrders = [
  {
    id: '1',
    orderNumber: 'ORD20240228001',
    date: '2024-02-28',
    total: 4912,
    status: 'delivered',
    items: 3,
  },
  {
    id: '2',
    orderNumber: 'ORD20240225002',
    date: '2024-02-25',
    total: 7500,
    status: 'shipped',
    items: 2,
  },
  {
    id: '3',
    orderNumber: 'ORD20240220003',
    date: '2024-02-20',
    total: 2999,
    status: 'confirmed',
    items: 1,
  },
];

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
  processing: { color: 'bg-purple-100 text-purple-800', label: 'Processing' },
  shipped: { color: 'bg-cyan-100 text-cyan-800', label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
};

export default function OrdersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground mt-2">View and manage your orders</p>
          </div>

          {/* Orders List */}
          {sampleOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
                <Button asChild className="bg-primary text-white hover:bg-primary/90">
                  <Link href="/products">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sampleOrders.map((order) => {
                const config = statusConfig[order.status as keyof typeof statusConfig];
                return (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                            <Badge className={config.color}>
                              {config.label}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div>
                              <p className="text-xs font-medium text-foreground mb-1">Order Date</p>
                              <p>{new Date(order.date).toLocaleDateString('en-PK')}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground mb-1">Items</p>
                              <p>{order.items} product(s)</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground mb-1">Total</p>
                              <p className="font-semibold text-foreground">
                                PKR {order.total.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground mb-1">Estimated Delivery</p>
                              <p>2-3 business days</p>
                            </div>
                          </div>
                        </div>
                        <Button asChild variant="outline" className="gap-2">
                          <Link href={`/orders/${order.orderNumber}`}>
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
