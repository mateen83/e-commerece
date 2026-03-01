import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { SetupBanner } from '@/components/setup-banner';
import { getProducts, getCategories } from '@/lib/services/products';

async function FeaturedProducts() {
  const products = await getProducts(8, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="aspect-square" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function Categories() {
  const categories = await getCategories();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.slice(0, 8).map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="p-6 rounded-lg border hover:border-primary hover:shadow-md transition-all text-center group"
        >
          {category.image_url && (
            <img
              src={category.image_url}
              alt={category.name}
              className="w-16 h-16 mx-auto mb-3 object-contain group-hover:scale-110 transition-transform"
            />
          )}
          <h3 className="font-medium text-sm">{category.name}</h3>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                Welcome to <span className="text-primary">PakMart</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your trusted online shopping destination for quality products in Pakistan. Fast delivery, secure payments, and great deals!
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild className="bg-primary text-white hover:bg-primary/90">
                  <Link href="/products">Start Shopping</Link>
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Setup Banner - shows when no data yet */}
        {/* <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SetupBanner />
          </div>
        </section> */}

        {/* Categories Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Shop by Category</h2>
            <Categories />
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
              <Button asChild variant="outline">
                <Link href="/products">View All</Link>
              </Button>
            </div>
            <Suspense fallback={<FeaturedProductsSkeleton />}>
              <FeaturedProducts />
            </Suspense>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="font-semibold">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Quick shipping across Pakistan with real-time tracking
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="font-semibold">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Multiple payment options including COD, JazzCash, and cards
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-semibold">Best Prices</h3>
                <p className="text-sm text-muted-foreground">
                  Amazing deals and discounts on top brands
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Sign Up for Exclusive Deals
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Get 10% off on your first order when you subscribe to our newsletter
            </p>
            <Button asChild className="bg-white text-primary hover:bg-white/90">
              <Link href="/auth/signup">Join Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
