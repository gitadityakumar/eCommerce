'use client';

import type { SelectBrand } from '@/lib/db/schema/brands';
import type { SelectColor } from '@/lib/db/schema/filters/colors';
import type { SelectGender } from '@/lib/db/schema/filters/genders';
import type { SelectSize } from '@/lib/db/schema/filters/sizes';
import { IconBuildingStore, IconGenderIntergender, IconPalette, IconRuler, IconSettings } from '@tabler/icons-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandTab } from './BrandTab';
import { ColorTab } from './ColorTab';
import { GenderTab } from './GenderTab';
import { ProductOptionsTab } from './ProductOptionsTab';
import { SizeTab } from './SizeTab';

interface AttributeDashboardProps {
  initialColors: SelectColor[];
  initialSizes: SelectSize[];
  initialGenders: SelectGender[];
  initialBrands: SelectBrand[];
}

export function AttributeDashboard({
  initialColors,
  initialSizes,
  initialGenders,
  initialBrands,
}: AttributeDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-light tracking-tighter text-text-primary font-playfair italic">Attribute Governance</h1>
        <p className="text-sm text-text-secondary font-light tracking-tight max-w-2xl">
          Synthesize and manage the global DNA of your collections—from chromatic spectrums to silhouette dimensions.
        </p>
      </div>

      <Tabs defaultValue="colors" className="space-y-8">
        <TabsList className="flex h-14 items-center justify-start gap-1 bg-surface/50 border border-border-subtle p-1 rounded-2xl w-fit overflow-hidden">
          <TabsTrigger value="colors" className="flex items-center gap-2 px-6 h-full rounded-xl data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-soft font-bold tracking-widest uppercase text-[10px] transition-all">
            <IconPalette size={14} strokeWidth={2.5} />
            Spectrum
          </TabsTrigger>
          <TabsTrigger value="sizes" className="flex items-center gap-2 px-6 h-full rounded-xl data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-soft font-bold tracking-widest uppercase text-[10px] transition-all">
            <IconRuler size={14} strokeWidth={2.5} />
            Scale
          </TabsTrigger>
          <TabsTrigger value="genders" className="flex items-center gap-2 px-6 h-full rounded-xl data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-soft font-bold tracking-widest uppercase text-[10px] transition-all">
            <IconGenderIntergender size={14} strokeWidth={2.5} />
            Archetype
          </TabsTrigger>
          <TabsTrigger value="brands" className="flex items-center gap-2 px-6 h-full rounded-xl data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-soft font-bold tracking-widest uppercase text-[10px] transition-all">
            <IconBuildingStore size={14} strokeWidth={2.5} />
            Houses
          </TabsTrigger>
          <TabsTrigger value="options" className="flex items-center gap-2 px-6 h-full rounded-xl data-[state=active]:bg-surface data-[state=active]:text-accent data-[state=active]:shadow-soft font-bold tracking-widest uppercase text-[10px] transition-all">
            <IconSettings size={14} strokeWidth={2.5} />
            Refinements
          </TabsTrigger>
        </TabsList>
        <TabsContent value="colors" className="space-y-4">
          <ColorTab initialData={initialColors} />
        </TabsContent>
        <TabsContent value="sizes" className="space-y-4">
          <SizeTab initialData={initialSizes} />
        </TabsContent>
        <TabsContent value="genders" className="space-y-4">
          <GenderTab initialData={initialGenders} />
        </TabsContent>
        <TabsContent value="brands" className="space-y-4">
          <BrandTab initialData={initialBrands} />
        </TabsContent>
        <TabsContent value="options" className="space-y-4">
          <ProductOptionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
