'use client';

import {
  Heart,
  LogOut,
  MapPin,
  Moon,
  Package,
  Sun,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { signOut } from '@/lib/auth/actions';
import { useAuthStore } from '@/store/auth';

export function ProfileDropdown() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Handle hydration mismatch for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut();
    logout();
    router.push('/');
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : 'GU';

  if (!mounted) {
    return (
      <button className="relative h-10 w-10 rounded-full flex items-center justify-center hover:bg-accent/5 transition-all duration-300">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-transparent! text-text-primary text-xs font-bold tracking-widest">
            GU
          </AvatarFallback>
        </Avatar>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full flex items-center justify-center hover:bg-accent/5 transition-all duration-300 outline-none focus:outline-none ring-0 focus:ring-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'Avatar'} />
            <AvatarFallback className="bg-transparent! text-text-primary text-xs font-bold tracking-widest">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 mt-2 p-0 rounded-2xl border-border-subtle bg-background/95 backdrop-blur-md shadow-soft animate-in fade-in-0 zoom-in-95 slide-in-from-top-2" align="end" forceMount>
        {/* Header Section */}
        <div className="p-6 pb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-4">Welcome back</p>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-border-subtle">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'Avatar'} />
              <AvatarFallback className="bg-surface text-text-primary text-sm font-bold tracking-widest">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1 overflow-hidden">
              <p className="text-sm font-bold tracking-tight text-text-primary truncate">
                {isAuthenticated ? (user?.name ?? 'Valued Customer') : 'Guest User'}
              </p>
              <p className="text-[11px] text-text-secondary font-light truncate">
                {isAuthenticated ? (user?.email ?? '') : 'Access exclusive collections'}
              </p>
            </div>
          </div>
          {!isAuthenticated && (
            <Button asChild className="w-full mt-6 rounded-full bg-accent text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-accent/90 shadow-soft">
              <Link href="/sign-in">Sign in / Register</Link>
            </Button>
          )}
        </div>

        {isAuthenticated && (
          <>
            <DropdownMenuSeparator className="bg-border-subtle opacity-50" />
          </>
        )}

        <DropdownMenuSeparator className="bg-border-subtle opacity-50" />

        {/* Menu Actions */}
        <DropdownMenuGroup className="p-2">
          <Link href="/profile">
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-accent/5 focus:bg-accent/5 transition-colors group">
              <User size={18} className="text-text-secondary group-hover:text-accent transition-colors" />
              <span className="text-sm font-light text-text-primary tracking-wide group-hover:text-accent transition-colors">My Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/orders">
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-accent/5 focus:bg-accent/5 transition-colors group">
              <Package size={18} className="text-text-secondary group-hover:text-accent transition-colors" />
              <span className="text-sm font-light text-text-primary tracking-wide group-hover:text-accent transition-colors">My Orders</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/wishlist">
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-accent/5 focus:bg-accent/5 transition-colors group">
              <Heart size={18} className="text-text-secondary group-hover:text-accent transition-colors" />
              <span className="text-sm font-light text-text-primary tracking-wide group-hover:text-accent transition-colors">Wishlist</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile/addresses">
            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer hover:bg-accent/5 focus:bg-accent/5 transition-colors group">
              <MapPin size={18} className="text-text-secondary group-hover:text-accent transition-colors" />
              <span className="text-sm font-light text-text-primary tracking-wide group-hover:text-accent transition-colors">Addresses</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-border-subtle opacity-50" />

        {/* Theme Toggle */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {resolvedTheme === 'dark'
              ? (
                  <Moon size={18} className="text-accent" />
                )
              : (
                  <Sun size={18} className="text-accent" />
                )}
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-primary">Aesthetic</span>
          </div>
          <Switch
            checked={resolvedTheme === 'dark'}
            onCheckedChange={checked => setTheme(checked ? 'dark' : 'light')}
            className="data-[state=checked]:bg-accent shadow-soft"
          />
        </div>

        {isAuthenticated && (
          <div className="p-2 pt-0">
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-destructive hover:text-accent/15 transition-colors group"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
              <span className="text-sm font-bold tracking-widest uppercase ">Logout</span>
            </DropdownMenuItem>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
