"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorTab } from "./ColorTab";
import { SizeTab } from "./SizeTab";
import { GenderTab } from "./GenderTab";
import { ProductOptionsTab } from "./ProductOptionsTab";
import { SelectColor } from "@/lib/db/schema/filters/colors";
import { SelectSize } from "@/lib/db/schema/filters/sizes";
import { SelectGender } from "@/lib/db/schema/filters/genders";
import { IconPalette, IconRuler, IconGenderIntergender, IconSettings } from "@tabler/icons-react";

interface AttributeDashboardProps {
  initialColors: SelectColor[];
  initialSizes: SelectSize[];
  initialGenders: SelectGender[];
}

export function AttributeDashboard({
  initialColors,
  initialSizes,
  initialGenders,
}: AttributeDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Attributes Management</h1>
        <p className="text-muted-foreground">
          Manage global attributes like colors, sizes, and genders, or product-specific options.
        </p>
      </div>

      <Tabs defaultValue="colors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <IconPalette size={16} />
            Colors
          </TabsTrigger>
          <TabsTrigger value="sizes" className="flex items-center gap-2">
            <IconRuler size={16} />
            Sizes
          </TabsTrigger>
          <TabsTrigger value="genders" className="flex items-center gap-2">
            <IconGenderIntergender size={16} />
            Genders
          </TabsTrigger>
          <TabsTrigger value="options" className="flex items-center gap-2">
            <IconSettings size={16} />
            Product Options
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
        <TabsContent value="options" className="space-y-4">
          <ProductOptionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
