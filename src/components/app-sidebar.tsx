"use client";

import * as React from "react";
import {
	IconBox,
	IconHash,
	IconHome,
	IconInnerShadowTop,
	IconLink,
	IconPackage,
	IconPlus,
	IconSearch,
	IconSettings,
	IconTag,
	IconTicket,
	IconUsers,
} from "@tabler/icons-react";

import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	quickLinks: [
		{
			title: "Dashboard",
			url: "/admin",
			icon: IconHome,
		},
		{
			title: "New Product",
			url: "/admin/products/new",
			icon: IconPlus,
		},
		{
			title: "New Coupon",
			url: "/admin/coupons",
			icon: IconTicket,
		},
		{
			title: "New Collection",
			url: "/admin/collections/new",
			icon: IconTag,
		},
	],
	catalog: [
		{
			title: "Products",
			url: "/admin/products",
			icon: IconBox,
		},
		{
			title: "Categories",
			url: "/admin/categories",
			icon: IconLink,
		},
		{
			title: "Collections",
			url: "/admin/collections",
			icon: IconTag,
		},
		{
			title: "Attributes",
			url: "/admin/attributes",
			icon: IconHash,
		},
	],
	sale: [
		{
			title: "Orders",
			url: "/admin/orders",
			icon: IconPackage,
		},
	],
	customer: [
		{
			title: "Customers",
			url: "/admin/customers",
			icon: IconUsers,
		},
	],
	setting: [
		{
			title: "SETTING",
			url: "#",
			icon: IconSettings,
		},
	],
	navSecondary: [
		
		{
			title: "Search",
			url: "#",
			icon: IconSearch,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<Link href="/admin">
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">Pretty Twist</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.quickLinks} label="QUICK LINKS" />
				<NavMain items={data.catalog} label="CATALOG" />
				<NavMain items={data.sale} label="SALE" />
				<NavMain items={data.customer} label="CUSTOMER" />
				<NavMain items={data.setting} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
