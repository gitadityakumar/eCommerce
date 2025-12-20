'use client';
import type { Icon } from '@tabler/icons-react';

import Link from 'next/link';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
  label,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  label?: string;
}) {
  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {/* <SidebarMenuItem className="flex items-center gap-2"> */}
          {/*   <SidebarMenuButton */}
          {/*     tooltip="Quick Create" */}
          {/*     className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear" */}
          {/*   > */}
          {/*     <IconCirclePlusFilled /> */}
          {/*     <span>Quick Create</span> */}
          {/*   </SidebarMenuButton> */}
          {/*   <Button */}
          {/*     size="icon" */}
          {/*     className="size-8 group-data-[collapsible=icon]:opacity-0" */}
          {/*     variant="outline" */}
          {/*   > */}
          {/*     <IconMail /> */}
          {/*     <span className="sr-only">Inbox</span> */}
          {/*   </Button> */}
          {/* </SidebarMenuItem> */}
        </SidebarMenu>
        <SidebarMenu className="gap-1">
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} className="data-[slot=sidebar-menu-button]:h-9 data-[slot=sidebar-menu-button]:px-3">
                <Link href={item.url} className="flex items-center gap-3">
                  {item.icon && <item.icon className="!size-4.5" />}
                  <span className="font-medium text-[13.5px]">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
