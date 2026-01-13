'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, CheckCircle2, Lock, MapPin, Tag, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { validateCoupon } from '@/actions/coupons';
import { AddressForm } from '@/app/(root)/profile/addresses/AddressForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatINR } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart';

const COURIERS = [
  { id: 'delhivery', name: 'Delhivery', price: 80, time: '3-5 Days' },
  { id: 'bluedart', name: 'Blue Dart', price: 150, time: '1-2 Days' },
  { id: 'ecom', name: 'Ecom Express', price: 60, time: '4-6 Days' },
  { id: 'shiprocket', name: 'Shiprocket', price: 100, time: '2-4 Days' },
];

interface CheckoutProps {
  initialAddresses: any[];
  storeSettings: any;
  user: any;
}

export default function Checkout({ initialAddresses, storeSettings, user }: CheckoutProps) {
  const router = useRouter();
  const items = useCartStore(s => s.items);
  const total = useCartStore(s => s.total); // Re-added total as it's used later
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push('/cart');
    }
  }, [items, isHydrated, router]);
  const [addresses] = useState(initialAddresses);
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find(a => a.isDefault)?.id || addresses[0]?.id || null,
  );
  const [selectedCourierId, setSelectedCourierId] = useState<string>(COURIERS[0].id);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: string; value: number } | null>(null);

  const selectedCourier = COURIERS.find(c => c.id === selectedCourierId)!;

  const discount = appliedCoupon
    ? (appliedCoupon.type === 'percentage' ? (total * appliedCoupon.value) / 100 : appliedCoupon.value)
    : 0;

  const subtotalAfterDiscount = total - discount;
  const taxAmount = storeSettings?.isTaxEnabled
    ? (subtotalAfterDiscount * Number(storeSettings.taxPercentage)) / 100
    : 0;

  const grandTotal = total + selectedCourier.price - discount + taxAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim())
      return;
    setIsApplying(true);
    try {
      const result = await validateCoupon(couponCode, total);
      if (result.success && result.data) {
        setAppliedCoupon({
          code: result.data.code,
          type: result.data.discountType,
          value: result.data.discountValue,
        });
        toast.success(`Promo code "${result.data.code}" applied successfully!`);
      }
      else {
        toast.error(result.error || 'Invalid promo code');
      }
    }
    catch {
      toast.error('Failed to apply promo code');
    }
    finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const handleAddressCreated = () => {
    setShowAddModal(false);
    // Refresh addresses from server (or we could just reload, but let's try to be smooth)
    // Actually, createAddress revalidatesPath, so a window.location.reload() or router.refresh() would work.
    // The user asked for "without losing performance", so maybe a manual state update or router.refresh()?
    // Let's stick to router.refresh() combined with a brief wait if needed, or just let revalidatePath handle it.
    // Actually, better to just reload for now to ensure consistency, as per previous implementation.
    window.location.reload();
  };

  return (
    <section className="container mx-auto px-4 py-12 min-h-screen bg-background animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-playfair tracking-tight text-text-primary">Checkout</h1>
          <p className="text-text-secondary font-light tracking-widest uppercase text-xs md:text-sm">
            Refine your selection and finalize your archival order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Side: Address & Delivery */}
          <div className="lg:col-span-7 space-y-16">
            {!isChangingAddress
              ? (
            /* Delivery Card View */
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-px bg-border-subtle flex-1" />
                      <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent flex items-center gap-2">
                        <MapPin size={14} />
                        Shipping Destination
                      </h2>
                      <div className="h-px bg-border-subtle flex-1" />
                    </div>

                    <div className="p-8 border border-accent bg-accent/5 ring-1 ring-accent/20 rounded-3xl relative overflow-hidden group transition-all duration-500">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-playfair text-text-primary mb-1">
                            Delivering to
                            {' '}
                            {user?.name || 'Guest'}
                          </h3>
                          <p className="text-[10px] uppercase tracking-widest text-accent font-bold">
                            Primary Archival Coordinate
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => setIsChangingAddress(true)}
                          className="text-xs uppercase tracking-widest font-bold text-accent hover:bg-accent/10 rounded-xl px-4"
                        >
                          Change
                        </Button>
                      </div>

                      {selectedAddress
                        ? (
                            <div className="space-y-2 p-4 bg-surface/40 r">
                              <div className="flex items-center gap-3 mb-2">
                                {/* <div className="p-2 rounded-lg bg-accent text-white">
                                  <Home size={14} />
                                </div> */}
                                {/* <p className="text-[10px] font-bold uppercase tracking-widest text-text-primary">
                                  {selectedAddress.type}
                                </p> */}
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-semibold tracking-tight text-text-primary">{selectedAddress.line1}</p>
                                {selectedAddress.line2 && (
                                  <p className="text-sm text-text-secondary/80 font-light">{selectedAddress.line2}</p>
                                )}
                                <p className="text-xs text-text-secondary/80 font-light">
                                  {selectedAddress.city}
                                  ,
                                  {selectedAddress.state}
                                  {' '}
                                  {selectedAddress.postalCode}
                                </p>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary/40 pt-1">
                                  {selectedAddress.country}
                                </p>
                              </div>
                            </div>
                          )
                        : (
                            <div className="text-center py-6 text-text-secondary italic text-sm">
                              No shipping address selected.
                            </div>
                          )}
                    </div>
                  </div>
                )
              : (
            /* Address Selection View */
                  <div className="space-y-8 animate-in slide-in-from-left duration-500">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-px bg-border-subtle flex-1" />
                        <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent flex items-center gap-2">
                          <MapPin size={14} />
                          Delivery Addresses (
                          {addresses.length}
                          )
                        </h2>
                        <div className="h-px bg-border-subtle flex-1" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {addresses.map(address => (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddressId(address.id)}
                          className={cn(
                            'group p-6 border transition-all duration-500 rounded-2xl cursor-pointer relative overflow-hidden flex items-center gap-6',
                            selectedAddressId === address.id
                              ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
                              : 'border-border-subtle/50 bg-surface/5 hover:bg-surface/10',
                          )}
                        >
                          <div className={cn(
                            'w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all duration-500 shrink-0',
                            selectedAddressId === address.id
                              ? 'border-accent bg-accent text-white scale-110'
                              : 'border-border-subtle/50',
                          )}
                          >
                            {selectedAddressId === address.id && <Check size={12} />}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-text-primary">
                                {address.type}
                              </p>
                              {address.isDefault && (
                                <span className="text-[8px] bg-accent/10 text-accent px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Default</span>
                              )}
                            </div>
                            <p className="text-sm font-semibold tracking-tight text-text-primary line-clamp-1">{address.line1}</p>
                            <p className="text-xs text-text-secondary/80 font-light truncate">
                              {address.city}
                              ,
                              {address.state}
                              {' '}
                              {address.postalCode}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-4">
                      <Button
                        variant="ghost"
                        onClick={() => setShowAddModal(true)}
                        className="w-full py-6 rounded-2xl border border-dashed border-border-subtle hover:border-accent hover:bg-accent/5 text-text-secondary hover:text-accent transition-all duration-500 text-xs uppercase tracking-widest font-bold flex items-center gap-2"
                      >
                        <MapPin size={14} />
                        Add New Delivery Address
                      </Button>

                      <Button
                        disabled={!selectedAddressId}
                        onClick={() => setIsChangingAddress(false)}
                        className="w-full py-8 rounded-full bg-accent text-white font-bold text-xs tracking-[0.2em] uppercase hover:bg-accent/90 shadow-soft transition-all duration-500"
                      >
                        Deliver to this address
                      </Button>
                    </div>
                  </div>
                )}

            {/* Add Address Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogContent className="sm:max-w-[600px] bg-background border-border-subtle rounded-3xl overflow-hidden p-0">
                <div className="p-8 md:p-10">
                  <DialogHeader className="mb-8">
                    <DialogTitle className="text-3xl font-playfair tracking-tight text-text-primary">
                      New Archival Coordinate
                    </DialogTitle>
                    <p className="text-text-secondary font-light tracking-widest uppercase text-[10px]">
                      Specify your preferred delivery location
                    </p>
                  </DialogHeader>
                  <AddressForm onSuccess={handleAddressCreated} />
                </div>
              </DialogContent>
            </Dialog>

            {/* Courier Selection */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-px bg-border-subtle flex-1" />
                <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent">
                  Delivery Method
                </h2>
                <div className="h-px bg-border-subtle flex-1" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {COURIERS.map(courier => (
                  <div
                    key={courier.id}
                    onClick={() => setSelectedCourierId(courier.id)}
                    className={cn(
                      'group p-6 border transition-all duration-500 rounded-2xl cursor-pointer text-center space-y-3 relative',
                      selectedCourierId === courier.id
                        ? 'border-accent bg-accent/5'
                        : 'border-border-subtle/50 bg-surface/5 hover:bg-surface/10',
                    )}
                  >
                    <div className={cn(
                      'mx-auto w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all duration-500',
                      selectedCourierId === courier.id ? 'border-accent bg-accent text-white scale-110' : 'border-border-subtle/50',
                    )}
                    >
                      {selectedCourierId === courier.id && <Check size={14} />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-primary">{courier.name}</p>
                      <p className="text-sm font-semibold text-text-primary">{formatINR(courier.price)}</p>
                      <p className="text-[9px] text-text-secondary/60 uppercase tracking-tighter">{courier.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-surface border border-border-subtle/50 rounded-3xl p-8 md:p-10 flex flex-col shadow-soft min-h-[600px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-playfair tracking-tight text-text-primary">Order Manifest</h2>
                <span className="text-[10px] uppercase tracking-widest font-bold text-accent bg-accent/5 px-3 py-1 rounded-full">
                  {items.length}
                  {' '}
                  Units
                </span>
              </div>

              {/* Product List */}
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="relative h-16 w-16 bg-background border border-border-subtle/50 rounded-xl overflow-hidden shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5 self-center">
                      <h4 className="text-sm font-bold tracking-tight text-text-primary line-clamp-1">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] text-text-secondary/60 font-medium uppercase tracking-widest">
                          Qty:
                          {' '}
                          {item.quantity}
                        </p>
                        <p className="text-sm font-semibold tracking-tight text-text-primary">{formatINR(item.price)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-border-subtle/30 mb-8" />

              {/* Promo Code Section */}
              <div className="space-y-4 mb-8">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
                  <Tag size={12} className="text-accent" />
                  Privilege Key
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="ENTER CODE"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                      className="w-full bg-background/5 border border-border-subtle/50 rounded-xl px-4 py-3 text-xs tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-secondary/30"
                    />
                    {appliedCoupon && (
                      <button
                        onClick={removeCoupon}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-destructive transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={isApplying || !!appliedCoupon || !couponCode}
                    className="rounded-xl px-6 border-accent/20 text-accent hover:bg-accent hover:text-white font-bold text-[10px] tracking-widest uppercase transition-all duration-500 h-[46px]"
                  >
                    {isApplying ? '...' : 'Apply'}
                  </Button>
                </div>
                <AnimatePresence>
                  {appliedCoupon && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] font-medium text-green-600 flex items-center gap-1.5 px-1 uppercase tracking-wider"
                    >
                      <CheckCircle2 size={12} />
                      Benefit Active:
                      {' '}
                      {appliedCoupon.code}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Value Totals */}
              <div className="space-y-3 mb-auto">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary font-light tracking-wide italic">Subtotal</span>
                  <span className="text-text-primary font-bold tracking-tight">{formatINR(total)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary font-light tracking-wide italic">Editorial Delivery</span>
                  <span className="text-text-primary font-bold tracking-tight">{formatINR(selectedCourier.price)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-xs text-green-600">
                    <span className="font-medium tracking-wide italic">
                      Privilege Discount (
                      {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `${Math.round((discount / total) * 100)}%`}
                      )
                    </span>
                    <span className="font-bold tracking-tight">
                      -
                      {formatINR(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary font-light tracking-wide italic">
                    {storeSettings?.taxName || 'Tax'}
                    {' '}
                    Contribution (
                    {storeSettings?.taxPercentage || '0'}
                    %)
                  </span>
                  <span className="text-text-primary font-bold tracking-tight">{formatINR(taxAmount)}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border-subtle/50 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary mb-1">Final Valuation</p>
                    <p className="text-4xl font-playfair tracking-tighter text-text-primary">{formatINR(grandTotal)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-accent/5 border border-accent/10">
                    <Lock className="text-accent size-6" />
                  </div>
                </div>

                <Button
                  className="w-full py-8 rounded-full bg-accent text-white font-bold text-xs md:text-sm tracking-[0.3em] uppercase hover:bg-accent/90 shadow-[0_20px_50px_-12px_rgba(236,72,153,0.3)] hover:shadow-[0_20px_50px_-12px_rgba(236,72,153,0.5)] transition-all duration-700 flex items-center justify-center gap-3 group relative overflow-hidden"
                  size="lg"
                >
                  <span className="relative z-10">
                    Complete Transaction
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>

                <div className="bg-background/50 border border-border-subtle/30 p-4 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="text-accent size-4 mt-0.5 shrink-0" />
                  <p className="text-[9px] text-text-secondary leading-relaxed font-light italic uppercase tracking-wider">
                    Your order is protected by our editorial quality guarantee. Verified by
                    {' '}
                    <span className="font-bold text-text-primary not-italic">
                      PreetyTwist Luxury Assurance
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
