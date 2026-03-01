import { Suspense } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts, getCategories } from '@/lib/services/products';
import { ChevronRight } from 'lucide-react';

async function ProductsList() {
  const products = await getProducts(24, 0);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductsListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(12)].map((_, i) => (
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

async function CategoriesNav() {
  const categories = await getCategories();

  return (
    <div className="flex gap-2 overflow-x-auto pb-4">
      <Button
        variant="outline"
        asChild
        className="flex-shrink-0"
      >
        <Link href="/products">
          All Products
        </Link>
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          asChild
          className="flex-shrink-0"
        >
          <Link href={`/category/${category.slug}`}>
            {category.name}
          </Link>
        </Button>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">Products</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">All Products</h1>
            <p className="text-muted-foreground">Browse our complete collection of products</p>
          </div>

          {/* Categories Navigation */}
          <div className="mb-8">
            <Suspense fallback={<Skeleton className="h-10 w-full" />}>
              <CategoriesNav />
            </Suspense>
          </div>

          {/* Products Grid */}
          <Suspense fallback={<ProductsListSkeleton />}>
            <ProductsList />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
