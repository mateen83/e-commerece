'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ShoppingCart, Star } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Sample product data - replace with actual product fetch
  const product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    slug: slug,
    price: 4999,
    discount_price: 3499,
    rating: 4.5,
    rating_count: 128,
    stock: 45,
    description:
      'High-quality wireless headphones with active noise cancellation and 30-hour battery life.',
    images: ['/placeholder-product.jpg'],
    category: 'Electronics',
  };

  const discount = Math.round(((product.price - product.discount_price) / product.price) * 100);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} item(s) to cart`);
    router.push('/cart');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg border bg-muted overflow-hidden">
              <Image
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white hover:bg-red-600">
                  -{discount}%
                </Badge>
              )}
            </div>
            {/* Thumbnail gallery */}
            <div className="flex gap-4 overflow-x-auto">
              {[...Array(3)].map((_, i) => (
                <button
                  key={i}
                  className="flex-shrink-0 w-20 h-20 rounded border hover:border-primary transition-colors"
                >
                  <Image
                    src="/placeholder-product.jpg"
                    alt="Product thumbnail"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-muted-foreground">
              <span>{product.category}</span> &gt; <span>{product.name}</span>
            </div>

            {/* Title and Rating */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.rating_count} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  PKR {product.discount_price.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="text-xl text-muted-foreground line-through">
                    PKR {product.price.toLocaleString()}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-600">Save PKR {(product.price - product.discount_price).toLocaleString()}</p>
              )}
            </div>

            {/* Stock Status */}
            <div className="text-sm">
              {product.stock > 10 ? (
                <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
              ) : product.stock > 0 ? (
                <span className="text-orange-600 font-medium">Only {product.stock} left</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground">{product.description}</p>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock === 0}
                    className="px-3 py-2 text-muted-foreground hover:bg-muted disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-l border-r">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={product.stock === 0 || quantity >= product.stock}
                    className="px-3 py-2 text-muted-foreground hover:bg-muted disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-primary text-white hover:bg-primary/90 gap-2"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>

                <Button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  variant="outline"
                  size="lg"
                  className="w-12 h-12 p-0"
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''
                      }`}
                  />
                </Button>
              </div>
            </div>

            {/* Delivery Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Free shipping on orders over PKR 5,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated delivery: 2-3 business days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="text-center py-8 text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
