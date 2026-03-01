'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types/database';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const discount = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const displayPrice = product.discount_price || product.price;
  const originalPrice = product.price;

  return (
    <div className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-background">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            No Image
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600">
            -{discount}%
          </Badge>
        )}

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
          />
        </button>

        {/* Add to Cart Button - appears on hover */}
        {product.stock > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
            <Button
              onClick={() => {
                if (onAddToCart) {
                  onAddToCart(product.id);
                } else {
                  router.push('/cart');
                }
              }}
              className="w-full bg-primary text-white hover:bg-primary/90"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${i < Math.round(product.rating) ? '★' : '☆'
                    }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span>({product.rating_count})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            PKR {displayPrice.toLocaleString()}
          </span>
          {discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              PKR {originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock info */}
        <div className="mt-2 text-xs text-muted-foreground">
          {product.stock > 10 ? (
            <span className="text-green-600">In Stock</span>
          ) : product.stock > 0 ? (
            <span className="text-orange-600">Only {product.stock} left</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
