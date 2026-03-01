'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

// Sample cart data
const sampleCart = [
  {
    id: '1',
    product: {
      id: 'p1',
      name: 'Premium Wireless Headphones',
      slug: 'premium-wireless-headphones',
      image_url: '/placeholder-product.jpg',
      price: 4999,
      discount_price: 3499,
    },
    quantity: 1,
  },
  {
    id: '2',
    product: {
      id: 'p2',
      name: 'Smartphone Case',
      slug: 'smartphone-case',
      image_url: '/placeholder-product.jpg',
      price: 999,
      discount_price: 699,
    },
    quantity: 2,
  },
];

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState(sampleCart);
  const [couponCode, setCouponCode] = useState('');

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discount_price || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.17; // 17% GST
  const shipping = subtotal > 5000 ? 0 : 300;
  const total = subtotal + tax + shipping;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
            <p className="text-muted-foreground">Add some items to get started!</p>
            <Button asChild className="bg-primary text-white hover:bg-primary/90">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const displayPrice = item.product.discount_price || item.product.price;
              const originalPrice = item.product.price;
              const discount =
                displayPrice !== originalPrice
                  ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
                  : 0;

              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 rounded border bg-muted overflow-hidden">
                        <Image
                          src={item.product.image_url || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold hover:text-primary transition-colors">
                          <Link href={`/products/${item.product.slug}`}>
                            {item.product.name}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-primary font-bold">
                            PKR {displayPrice.toLocaleString()}
                          </span>
                          {discount > 0 && (
                            <>
                              <span className="text-muted-foreground line-through">
                                PKR {originalPrice.toLocaleString()}
                              </span>
                              <span className="text-red-500 text-xs">-{discount}%</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 text-muted-foreground hover:bg-muted"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 border-l border-r text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-muted-foreground hover:bg-muted"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          PKR {(displayPrice * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (17% GST)</span>
                    <span>PKR {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        <>PKR {shipping.toLocaleString()}</>
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>PKR {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white hover:bg-primary/90 gap-2"
                  size="lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>

                {/* Continue Shopping */}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">
                    Free shipping on orders over PKR 5,000
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    Estimated delivery: 2-3 business days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
