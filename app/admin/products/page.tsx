'use client';

import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Plus } from 'lucide-react';

// Sample products data
const sampleProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    sku: 'PWH-001',
    price: 4999,
    stock: 45,
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Smartphone Case',
    slug: 'smartphone-case',
    sku: 'SC-002',
    price: 999,
    stock: 8,
    category: 'Accessories',
  },
  {
    id: '3',
    name: 'USB-C Cable',
    slug: 'usb-c-cable',
    sku: 'UC-003',
    price: 499,
    stock: 2,
    category: 'Accessories',
  },
];

export default function AdminProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-muted-foreground mt-2">Manage your product catalog</p>
            </div>
            <Button asChild className="bg-primary text-white hover:bg-primary/90 gap-2">
              <Link href="/admin/products/new">
                <Plus className="w-4 h-4" />
                Add Product
              </Link>
            </Button>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-sm">{product.sku}</TableCell>
                        <TableCell>PKR {product.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={product.stock > 10 ? 'outline' : 'destructive'}
                          >
                            {product.stock} units
                          </Badge>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                          >
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
