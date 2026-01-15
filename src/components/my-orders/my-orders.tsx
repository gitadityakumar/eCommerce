'use client';

import {
  ArrowUpRight,
  ChevronRight,
  Loader2,
  Package,
  RotateCcw,
  Search,
  Star,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getUserOrders } from '@/actions/orders';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatINR } from '@/lib/currency';
import { cn } from '@/lib/utils';

type OrderData = Awaited<ReturnType<typeof getUserOrders>>[number];

function OrderCard({ order }: { order: OrderData }) {
  const getStatusBadge = (status: OrderData['status']) => {
    const variants: Record<
      OrderData['status'],
      { label: string; className: string; dot: string; text: string; bg: string }
    > = {
      pending: { label: 'Pending', className: 'text-amber-600', dot: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' },
      processing: { label: 'Processing', className: 'text-amber-600', dot: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' },
      paid: { label: 'Paid', className: 'text-emerald-600', dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' },
      shipped: { label: 'In Transit', className: 'text-blue-600', dot: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' },
      delivered: { label: 'Delivered', className: 'text-emerald-600', dot: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' },
      cancelled: { label: 'Cancelled', className: 'text-red-600', dot: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50' },
      failed: { label: 'Failed', className: 'text-red-600', dot: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50' },
      partially_shipped: { label: 'Partially Shipped', className: 'text-blue-600', dot: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' },
      returned: { label: 'Returned', className: 'text-gray-600', dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50' },
      refunded: { label: 'Refunded', className: 'text-gray-600', dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50' },
    };
    return variants[status] || { label: status, className: '', dot: 'bg-muted', text: 'text-muted-foreground', bg: 'bg-muted' };
  };

  const colors = getStatusBadge(order.status);
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isActiveOrder = ['pending', 'processing', 'paid', 'shipped', 'partially_shipped'].includes(order.status);

  return (
    <Card className="overflow-hidden border-none bg-surface/40 backdrop-blur-md shadow-sm rounded-3xl mb-8">
      {/* Order Info Header */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-border-subtle/30">
        <div className="flex items-center gap-12">
          <div>
            <p className="font-inter text-[10px] uppercase tracking-widest text-text-secondary/60 mb-1">Order placed</p>
            <p className="font-montserrat text-sm font-bold text-text-primary">{formattedDate}</p>
          </div>
          <div>
            <p className="font-inter text-[10px] uppercase tracking-widest text-text-secondary/60 mb-1">Order number</p>
            <p className="font-montserrat text-sm font-bold text-text-primary">
              PT-
              {order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div>
            <p className="font-inter text-[10px] uppercase tracking-widest text-text-secondary/60 mb-1">Total</p>
            <p className="font-montserrat text-sm font-bold text-text-primary">{formatINR(Number(order.totalAmount))}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('size-2 rounded-full', colors.dot)}></span>
          <span className={cn('font-montserrat text-xs font-bold tracking-tight', colors.className)}>
            {colors.label}
          </span>
        </div>
      </div>

      {/* Tracking Banner for Active Orders */}
      {isActiveOrder && (
        <div className="mx-8 mt-6 p-5 bg-accent/10 dark:bg-accent/5 rounded-2xl flex items-center justify-between border border-accent/20 dark:border-accent/10">
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-accent/20 dark:bg-accent/10">
              <Truck className="size-4 text-accent" />
            </div>
            <div>
              <p className="font-montserrat text-sm font-bold text-text-primary">
                Arriving
                {' '}
                {new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                -
                {new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric' })}
              </p>
              <p className="font-inter text-[11px] text-text-secondary font-medium italic">Your package is on its way</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-background/50 dark:bg-accent/5 border-border-subtle hover:bg-accent hover:text-white hover:border-accent font-montserrat text-[10px] font-bold tracking-widest uppercase rounded-xl h-9 transition-all duration-300">
            Track
            <ArrowUpRight className="ml-2 size-3" />
          </Button>
        </div>
      )}

      {/* Items List */}
      <CardContent className="p-8 space-y-8">
        {order.items.map((item, idx) => (
          <div key={item.id} className="relative group">
            {idx > 0 && <Separator className="bg-border-subtle/20 mb-8" />}
            <div className="flex gap-8">
              <div className="w-28 shrink-0">
                <AspectRatio ratio={4 / 5} className="overflow-hidden rounded-2xl bg-muted/30 border border-border-subtle/30 shadow-sm">
                  {item.variant?.product?.images?.[0]
                    ? (
                        <Image
                          src={item.variant.product.images[0].url}
                          alt={item.variant.product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )
                    : (
                        <div className="flex size-full items-center justify-center bg-muted/20 text-text-secondary text-[10px] font-montserrat uppercase tracking-wider text-center p-2 italic leading-relaxed">
                          Atelier Item
                        </div>
                      )}
                </AspectRatio>
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="font-playfair text-xl text-text-primary tracking-tight">
                      {item.variant?.product?.name || 'Artisan Accessory'}
                    </h3>
                    <p className="font-inter text-xs text-text-secondary font-medium tracking-tight">
                      {item.variant?.color?.name || 'Standard'}
                      {' '}
                      •
                      {' '}
                      {item.variant?.size?.name || 'OS'}
                    </p>
                  </div>
                  <p className="font-montserrat font-bold text-text-primary">
                    {formatINR(Number(item.priceAtPurchase))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      {/* Footer Actions */}
      <div className="px-8 py-5 flex items-center justify-between border-t border-border-subtle/30 bg-muted/5">
        <div className="flex items-center gap-6">
          <Button variant="link" size="sm" className="h-auto p-0 font-montserrat text-[10px] font-bold tracking-[0.2em] uppercase text-text-primary hover:text-accent transition-colors decoration-accent/30 underline-offset-8" asChild>
            <Link href={`/checkout/success?orderId=${order.id}`}>
              Review Document
              <ChevronRight className="ml-1.5 size-3" />
            </Link>
          </Button>
          <Button variant="link" size="sm" className="h-auto p-0 font-montserrat text-[10px] font-bold tracking-[0.2em] uppercase text-text-secondary/60 hover:text-accent transition-colors" asChild>
            <Link href="/contact">Client Concierge</Link>
          </Button>
        </div>

        {order.status === 'delivered' && (
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="font-montserrat text-[10px] font-bold tracking-widest uppercase hover:text-accent">
              <Star className="mr-2 size-3.5" />
              Critique
            </Button>
            <Button variant="secondary" size="sm" className="bg-primary/5 hover:bg-primary/10 font-montserrat text-[10px] font-bold tracking-widest uppercase rounded-xl h-9">
              <RotateCcw className="mr-2 size-3.5" />
              Buy Again
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await getUserOrders();
        setOrders(data);
      }
      catch (error) {
        console.error('Failed to fetch orders:', error);
      }
      finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    let tabMatch = true;
    if (activeTab === 'active') {
      tabMatch = ['pending', 'processing', 'paid', 'shipped', 'partially_shipped'].includes(order.status);
    }
    else if (activeTab === 'delivered') {
      tabMatch = order.status === 'delivered';
    }
    else if (activeTab === 'returns') {
      tabMatch = ['returned', 'refunded'].includes(order.status);
    }

    const searchMatch = searchQuery === ''
      || order.id.toLowerCase().includes(searchQuery.toLowerCase())
      || order.items.some(item =>
        item.variant?.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return tabMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="py-20 md:py-32 w-full min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="font-playfair text-5xl md:text-6xl font-light tracking-tight text-text-primary mb-4">Your Orders</h1>
          <p className="font-inter text-text-secondary font-light tracking-widest uppercase text-xs md:text-sm">
            Track, return, or buy items again
          </p>
        </div>

        {/* Global Controls */}
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setCurrentPage(1);
            }}
            className="w-full lg:w-auto"
          >
            <TabsList className="bg-surface/30 border border-border-subtle p-1.5 rounded-full h-12 inline-flex items-center">
              <TabsTrigger value="all" className="rounded-full h-9 px-6 font-montserrat text-[10px] font-bold tracking-widest uppercase transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-accent/20 dark:data-[state=active]:text-accent data-[state=active]:shadow-sm">All Orders</TabsTrigger>
              <TabsTrigger value="active" className="rounded-full h-9 px-6 font-montserrat text-[10px] font-bold tracking-widest uppercase transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-accent/20 dark:data-[state=active]:text-accent data-[state=active]:shadow-sm">In Progress</TabsTrigger>
              <TabsTrigger value="delivered" className="rounded-full h-9 px-6 font-montserrat text-[10px] font-bold tracking-widest uppercase transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-accent/20 dark:data-[state=active]:text-accent data-[state=active]:shadow-sm">Delivered</TabsTrigger>
              <TabsTrigger value="returns" className="rounded-full h-9 px-6 font-montserrat text-[10px] font-bold tracking-widest uppercase transition-all duration-300 data-[state=active]:bg-white dark:data-[state=active]:bg-accent/20 dark:data-[state=active]:text-accent data-[state=active]:shadow-sm">Returns</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative group">
            <Search className="absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-text-secondary/40 group-focus-within:text-accent transition-colors duration-300" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 h-12 sm:w-80 rounded-2xl border-border-subtle bg-surface/20 backdrop-blur-sm focus:ring-accent/10 focus:border-accent font-inter text-sm placeholder:text-text-secondary/30 transition-all duration-500"
            />
          </div>
        </div>

        {/* Content Listing */}
        <div className="space-y-4">
          {loading
            ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6 text-text-secondary">
                  <div className="relative size-12">
                    <Loader2 className="size-full animate-spin text-accent/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-2 bg-accent rounded-full animate-pulse" />
                    </div>
                  </div>
                  <p className="font-montserrat text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">Curating your manifest…</p>
                </div>
              )
            : filteredOrders.length > 0
              ? (
                  <>
                    {currentOrders.map(order => (
                      <div key={order.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <OrderCard order={order} />
                      </div>
                    ))}

                    {totalPages > 1 && (
                      <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        <Pagination>
                          <PaginationContent className="bg-surface/30 backdrop-blur-[2px] border border-border-subtle/50 rounded-full p-2 shadow-soft">
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage > 1) {
                                    setCurrentPage(c => c - 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }
                                }}
                                className={cn(
                                  'transition-all duration-300 font-montserrat text-[10px] font-bold tracking-widest uppercase hover:bg-accent hover:text-white rounded-full',
                                  currentPage === 1 && 'pointer-events-none opacity-50',
                                )}
                              />
                            </PaginationItem>

                            <div className="flex items-center px-4 font-inter text-xs font-medium text-text-secondary">
                              <span className="text-text-primary">{currentPage}</span>
                              <span className="mx-2 opacity-30">/</span>
                              <span>{totalPages}</span>
                            </div>

                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage < totalPages) {
                                    setCurrentPage(c => c + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }
                                }}
                                className={cn(
                                  'transition-all duration-300 font-montserrat text-[10px] font-bold tracking-widest uppercase hover:bg-accent hover:text-white rounded-full',
                                  currentPage === totalPages && 'pointer-events-none opacity-50',
                                )}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )
              : (
                  <div className="text-center py-40 bg-surface/10 rounded-[3rem] border border-dashed border-border-subtle/30 backdrop-blur-sm">
                    <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full bg-accent/5">
                      <Package className="size-8 text-accent/20" />
                    </div>
                    <h2 className="text-text-primary font-playfair text-3xl mb-3 font-light tracking-tight">Archive Empty</h2>
                    <p className="text-text-secondary font-inter text-sm mb-10 font-light italic max-w-sm mx-auto">Your collection is currently waiting for a new architectural masterpiece to be cataloged.</p>
                    <Button asChild className="bg-primary hover:bg-accent text-primary-foreground font-montserrat font-bold text-[10px] tracking-widest uppercase h-12 px-10 rounded-full transition-all duration-500 shadow-soft">
                      <Link href="/products">Curate Now</Link>
                    </Button>
                  </div>
                )}
        </div>
      </div>
    </section>
  );
}
