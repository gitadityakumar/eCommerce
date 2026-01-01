import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border-subtle bg-surface/50 backdrop-blur-md sticky top-0 z-30 transition-[width,height,background-color] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-text-secondary hover:text-accent transition-colors" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 bg-border-subtle"
        />
        <div className="ml-auto flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/60 hidden md:block">
            System Operational
          </span>
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex rounded-full px-4 hover:bg-accent/5 hover:text-accent border border-transparent hover:border-accent/10 transition-all">
            <a
              href="/"
              rel="noopener noreferrer"
              target="_blank"
              className="text-text-primary font-medium text-xs tracking-wider"
            >
              View Store
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
