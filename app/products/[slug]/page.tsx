'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ShoppingCart, Star, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { updateCartItem, getCart } from '@/lib/services/cart';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  // Next.js 15 requires unwrapping params Promise
  const { slug } = use(params);

  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error || !data) {
          setError("Product not found");
          return;
        }

        setProduct(data);

        if (data.category_id) {
          const { data: catData } = await supabase
            .from('categories')
            .select('*')
            .eq('id', data.category_id)
            .single();
          if (catData) setCategory(catData);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError("Network error connecting to database");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Authenticated user
        const cart = await getCart(user.id);
        const existingItem = cart.items?.find((item: any) => item.product_id === product.id);
        const newQuantity = (existingItem?.quantity || 0) + quantity;
        await updateCartItem(user.id, product.id, newQuantity);
      } else {
        // Guest user using localStorage
        const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
        const existingIndex = guestCart.findIndex((item: any) => item.product_id === product.id);

        if (existingIndex >= 0) {
          guestCart[existingIndex].quantity += quantity;
        } else {
          guestCart.push({
            id: `guest_${Date.now()}_${Math.random()}`,
            product_id: product.id,
            quantity: quantity,
            product: product
          });
        }
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      }

      router.push('/cart');
    } catch (e) {
      console.error('Failed to add to cart:', e);
    } finally {
      setAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading product details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <p className="text-xl text-red-500 mb-4">{error || "Product not found"}</p>
          <Button onClick={() => router.push('/products')}>Back to Products</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const discountPrice = product.discount_price || product.price;
  const originalPrice = product.price;
  const discount = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg border bg-muted overflow-hidden">
              <Image
                src={product.image_url || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-contain"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white hover:bg-red-600">
                  -{discount}%
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-muted-foreground">
              <span>{category?.name || 'Category'}</span> &gt; <span>{product.name}</span>
            </div>

            {/* Title and Rating */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(product.rating || 4.5)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating || 4.5} ({product.rating_count || 128} reviews)
                </span>
                <span className="text-sm text-muted-foreground ml-2">SKU: {product.sku || 'N/A'}</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  PKR {discountPrice.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="text-xl text-muted-foreground line-through">
                    PKR {originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-600">Save PKR {(originalPrice - discountPrice).toLocaleString()}</p>
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
                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                    disabled={product.stock === 0 || quantity >= (product.stock || 1)}
                    className="px-3 py-2 text-muted-foreground hover:bg-muted disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Subtotal: <span className="font-semibold text-foreground">PKR {(discountPrice * quantity).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                >
                  {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-4 hover:text-red-500 hover:border-red-500 hover:bg-red-50"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="pt-6 border-t space-y-4">
                <h3 className="font-semibold text-lg">Specifications</h3>
                <dl className="space-y-2 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b last:border-0 border-muted">
                      <dt className="text-muted-foreground font-medium">{key}</dt>
                      <dd className="col-span-2">{value as string}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs Placeholder */}
        <div className="mt-16">
          <Card>
            <CardHeader className="border-b bg-muted/20">
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
