'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PAKISTAN_CITIES } from '@/lib/types/database';
import { ArrowLeft, Truck, CreditCard, Loader2 } from 'lucide-react';
import { processCheckout } from './actions';

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 'shipping') {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('review');
    }
  };

  const handlePreviousStep = () => {
    if (step === 'payment') {
      setStep('shipping');
    } else if (step === 'review') {
      setStep('payment');
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);

    // In a real app, these items/totals would come from a Cart Context/State
    // We are hardcoding them here for the demo based on the current UI text
    const response = await processCheckout({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      paymentMethodCode: paymentMethod,
      items: [
        { product_id: '1', quantity: 1, price: 3499 },
        { product_id: '2', quantity: 2, price: 699 }
      ],
      subtotal: 4198,
      tax: 714,
      shipping: 0
    });

    setIsLoading(false);

    if (response.success) {
      router.push(`/order-confirmation?order=${response.orderNumber}`);
    } else {
      alert(`Failed to place order: ${response.error}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-8 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Indicator */}
        <div className="mb-8 flex gap-2">
          {(['shipping', 'payment', 'review'] as const).map((s, index) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === s || ['shipping', 'payment', 'review'].indexOf(step) > index
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                  }`}
              >
                {index + 1}
              </div>
              <span className="text-sm font-medium capitalize">{s}</span>
              {index < 2 && <div className="h-0.5 w-8 bg-muted" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Address Step */}
            {step === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+92 300 1234567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                        <SelectTrigger id="city">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAKISTAN_CITIES.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        placeholder="75500"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleNextStep}
                    disabled={!formData.fullName || !formData.address || !formData.city}
                    className="w-full bg-primary text-white hover:bg-primary/90"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Payment Method Step */}
            {step === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      {[
                        { value: 'COD', label: 'Cash on Delivery (COD)' },
                        { value: 'JAZZCASH', label: 'JazzCash' },
                        { value: 'EASYPAISA', label: 'EasyPaisa' },
                        { value: 'BANK', label: 'Bank Transfer' },
                        { value: 'CARD', label: 'Credit/Debit Card' },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value={value} id={value} />
                          <Label htmlFor={value} className="cursor-pointer flex-1">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  <div className="flex gap-4">
                    <Button onClick={handlePreviousStep} variant="outline" className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="flex-1 bg-primary text-white hover:bg-primary/90"
                    >
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Info */}
                  <div className="border-b pb-4">
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-sm">{formData.fullName}</p>
                    <p className="text-sm text-muted-foreground">{formData.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.city}, {formData.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">{formData.phone}</p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <p className="text-sm">{paymentMethod}</p>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handlePreviousStep} variant="outline" className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                      className="flex-1 bg-primary text-white hover:bg-primary/90"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {isLoading ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>PKR 4,198</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (17%)</span>
                    <span>PKR 714</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>PKR 4,912</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
                  Estimated delivery: 2-3 business days
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
