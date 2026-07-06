'use client';

import type { Icon } from '@tabler/icons-react';
import {
  IconActivity,
  IconArchive,
  IconBox,
  IconDashboard,
  IconGift,
  IconHash,
  IconHistory,
  IconLink,
  IconPlus,
  IconSettings,
  IconShoppingBag,
  IconTag,
  IconUsers,
} from '@tabler/icons-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';

type AdminRole = 'admin' | 'staff';

interface AdminSidebarUser {
  name?: string | null;
  email: string;
  image?: string | null;
  role: string;
}

interface NavItem {
  title: string;
  url: string;
  icon?: Icon;
  roles?: AdminRole[];
}

function filterByRole(items: NavItem[], role: string) {
  return items.filter(item => !item.roles || item.roles.includes(role as AdminRole));
}

const data = {
  quickLinks: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: IconDashboard,
    },
    {
      title: 'New Product',
      url: '/admin/products/new',
      icon: IconPlus,
      roles: ['admin'],
    },
    {
      title: 'New Coupon',
      url: '/admin/coupons/new',
      icon: IconGift,
      roles: ['admin'],
    },
  ],
  catalog: [
    {
      title: 'Products',
      url: '/admin/products',
      icon: IconBox,
    },
    {
      title: 'Categories',
      url: '/admin/categories',
      icon: IconLink,
    },
    {
      title: 'Collections',
      url: '/admin/collections',
      icon: IconTag,
    },
    {
      title: 'Attributes',
      url: '/admin/attributes',
      icon: IconHash,
    },
  ],
  sale: [
    {
      title: 'Orders',
      url: '/admin/orders',
      icon: IconShoppingBag,
    },
    {
      title: 'Coupons',
      url: '/admin/coupons',
      icon: IconGift,
    },
    {
      title: 'Inventory',
      url: '/admin/inventory',
      icon: IconArchive,
    },
  ],
  customer: [
    {
      title: 'Customers',
      url: '/admin/customers',
      icon: IconUsers,
    },
  ],
  system: [
    {
      title: 'Audit Logs',
      url: '/admin/audit-logs',
      icon: IconHistory,
    },
    {
      title: 'Sessions',
      url: '/admin/sessions',
      icon: IconActivity,
    },
  ],
  setting: [
    {
      title: 'Setting',
      url: '/admin/settings',
      icon: IconSettings,
      roles: ['admin'],
    },
  ],
} satisfies Record<string, NavItem[]>;

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: AdminSidebarUser }) {
  const navUser = {
    name: user.name || user.email,
    email: user.email,
    avatar: user.image || '/avatars/admin.jpg',
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* <SidebarHeader className="border-b border-sidebar-border/50 px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-0! hover:bg-transparent active:bg-transparent"
            >
              <a href="/admin" className="flex items-center gap-3 group">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-accent text-white shadow-soft shadow-accent/20 group-hover:scale-105 transition-transform duration-500">
                  <IconInnerShadowTop className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none px-1">
                  <span className="text-xl font-bold tracking-tighter text-text-primary">PreetyTwist</span>
                  <span className="text-[10px] text-accent font-bold uppercase tracking-[0.2em]">Admin</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent className="gap-0 py-2">
        <NavMain label="Quick Links" items={filterByRole(data.quickLinks, user.role)} />
        <NavMain label="Catalog" items={filterByRole(data.catalog, user.role)} />
        <NavMain label="Sale" items={filterByRole(data.sale, user.role)} />
        <NavMain label="Customer" items={filterByRole(data.customer, user.role)} />
        <NavMain label="System" items={filterByRole(data.system, user.role)} />
        <NavMain label="Setting" items={filterByRole(data.setting, user.role)} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50">
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
