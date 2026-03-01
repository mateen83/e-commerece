'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    { label: 'Electronics', href: '/category/electronics' },
    { label: 'Fashion', href: '/category/fashion-apparel' },
    { label: 'Home & Kitchen', href: '/category/home-kitchen' },
    { label: 'Sports', href: '/category/sports-outdoors' },
    { label: 'Books', href: '/category/books-media' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with logo and search */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
              PM
            </div>
            <span className="hidden sm:inline">PakMart</span>
          </Link>

          {/* Search bar - hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="flex w-full gap-2">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="bg-primary text-white hover:bg-primary/90">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link href="/account">
                <User className="w-5 h-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
            </Button>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full">
                <div className="flex flex-col gap-4 mt-8">
                  {/* Mobile search */}
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" className="bg-primary text-white">
                      <Search className="w-4 h-4" />
                    </Button>
                  </form>

                  {/* Mobile nav items */}
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-base hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <div className="border-t pt-4 mt-4">
                    <Link
                      href="/account"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-base hover:text-primary transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Account
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Bottom navigation - hidden on mobile */}
        <nav className="hidden md:flex gap-6 h-12 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
