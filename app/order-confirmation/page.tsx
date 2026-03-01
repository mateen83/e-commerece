import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Truck, MapPin } from 'lucide-react';

export default function OrderConfirmationPage() {
  const orderNumber = 'ORD' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '1234';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center space-y-4 mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-mono font-semibold">{orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold">{new Date().toLocaleDateString('en-PK')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold">PKR 4,912</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-semibold">Cash on Delivery</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">John Doe</p>
              <p className="text-sm text-muted-foreground">123 Main Street</p>
              <p className="text-sm text-muted-foreground">Karachi, 75500</p>
              <p className="text-sm text-muted-foreground">+92 300 1234567</p>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: 'Order Placed', status: 'complete', date: 'Today' },
                  { step: 'Confirmed', status: 'pending', date: 'Soon' },
                  { step: 'Shipped', status: 'pending', date: 'In 1-2 days' },
                  { step: 'Delivered', status: 'pending', date: 'In 2-3 days' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          item.status === 'complete'
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.status === 'complete' ? '✓' : index + 1}
                      </div>
                      {index < 3 && <div className="h-12 w-0.5 bg-muted mt-2" />}
                    </div>
                    <div className="pt-1.5">
                      <p className="font-medium">{item.step}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/orders/${orderNumber}`}>View Order Details</Link>
            </Button>
            <Button asChild className="flex-1 bg-primary text-white hover:bg-primary/90">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>

          {/* Info Message */}
          <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-900 space-y-2">
            <p className="font-medium">What happens next?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>You will receive an order confirmation email shortly</li>
              <li>Our team will prepare your order for shipment</li>
              <li>You'll get a tracking link once your package ships</li>
              <li>Estimated delivery: 2-3 business days</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
