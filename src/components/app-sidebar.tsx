'use client';

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

const data = {
  user: {
    name: 'Admin User',
    email: 'admin@preetytwist.com',
    avatar: '/avatars/admin.jpg',
  },
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
    },
    {
      title: 'New Coupon',
      url: '/admin/coupons/new',
      icon: IconGift,
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
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain label="Quick Links" items={data.quickLinks} />
        <NavMain label="Catalog" items={data.catalog} />
        <NavMain label="Sale" items={data.sale} />
        <NavMain label="Customer" items={data.customer} />
        <NavMain label="System" items={data.system} />
        <NavMain label="Setting" items={data.setting} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
