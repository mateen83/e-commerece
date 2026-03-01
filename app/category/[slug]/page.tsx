import { Suspense } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { getProductsByCategory, getCategoryBySlug } from '@/lib/services/products';
import { ChevronRight } from 'lucide-react';

async function CategoryProducts({ categorySlug }: { categorySlug: string }) {
  try {
    const category = await getCategoryBySlug(categorySlug);
    const products = await getProductsByCategory(category.id, 20, 0);

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products in this category yet</p>
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
  } catch (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Category not found</p>
      </div>
    );
  }
}

function ProductsGridSkeleton() {
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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

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
              <Link href="/products" className="text-muted-foreground hover:text-foreground">
                Products
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground capitalize">{slug.replace('-', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 capitalize">
              {slug.replace('-', ' ')}
            </h1>
            <p className="text-muted-foreground">Browse our collection in this category</p>
          </div>

          {/* Products Grid */}
          <Suspense fallback={<ProductsGridSkeleton />}>
            <CategoryProducts categorySlug={slug} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
