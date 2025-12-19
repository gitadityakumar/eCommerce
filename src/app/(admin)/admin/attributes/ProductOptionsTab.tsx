"use client";

import { useState, useEffect, useCallback } from "react";
import { getProducts } from "@/actions/products";
import { 
  getProductOptions, 
  createProductOption, 
  deleteProductOption,
  createProductOptionValue,
  deleteProductOptionValue
} from "@/actions/attributes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  PlusCircle, 
  ChevronRight,
  Search,
  Info,
  Lightbulb,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function ProductOptionsTab() {
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [options, setOptions] = useState<{ id: string; name: string; values: { id: string; value: string }[] }[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionValues, setNewOptionValues] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        toast.error("Failed to fetch products");
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  const fetchOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    try {
      const result = await getProductOptions(selectedProductId);
      if (result.success) {
        setOptions(result.data || []);
      } else {
        toast.error(result.error as string);
      }
    } catch {
      toast.error("Failed to fetch options");
    } finally {
      setIsLoadingOptions(false);
    }
  }, [selectedProductId]);

  useEffect(() => {
    if (selectedProductId) {
      fetchOptions();
    } else {
      setOptions([]);
    }
  }, [selectedProductId, fetchOptions]);

  async function handleAddOption() {
    if (!newOptionName.trim()) {
      toast.error("Please enter an option name (e.g. Material)");
      return;
    }
    setIsAddingOption(true);
    try {
      const result = await createProductOption({
        productId: selectedProductId,
        name: newOptionName,
        sortOrder: options.length,
      });
      if (result.success) {
        toast.success("Option added");
        setNewOptionName("");
        fetchOptions();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to add option");
    } finally {
      setIsAddingOption(false);
    }
  }

  async function handleDeleteOption(id: string) {
    try {
      const result = await deleteProductOption(id);
      if (result.success) {
        toast.success("Option deleted");
        fetchOptions();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to delete option");
    }
  }

  async function handleAddValue(optionId: string) {
    const value = newOptionValues[optionId];
    if (!value || !value.trim()) return;

    try {
      const result = await createProductOptionValue({
        optionId,
        value,
        sortOrder: options.find(o => o.id === optionId)?.values.length || 0,
      });
      if (result.success) {
        toast.success("Value added");
        setNewOptionValues(prev => ({ ...prev, [optionId]: "" }));
        fetchOptions();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to add value");
    }
  }

  async function handleDeleteValue(id: string) {
    try {
      const result = await deleteProductOptionValue(id);
      if (result.success) {
        toast.success("Value deleted");
        fetchOptions();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to delete value");
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5 text-primary" />
            Select Product
          </CardTitle>
          <CardDescription>
            Search and select a product to manage its specific specifications and custom options.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showInfo && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 flex gap-3 items-start relative group">
              <Info className="size-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="space-y-1 pr-8">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Understanding Product Options</p>
                <p className="text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                  Global attributes (Colors, Sizes) apply to all products. **Product Options** are for unique specifications like &quot;Material&quot;, &quot;Fabric&quot;, or &quot;Style&quot; specific to this product. These options help define the unique characteristics of your product variants.
                </p>
              </div>
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute top-3 right-3 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 transition-colors"
                title="Dismiss"
              >
                <X className="size-4" />
              </button>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Filter products..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedProductId} onValueChange={setSelectedProductId} disabled={isLoadingProducts}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder={isLoadingProducts ? "Loading products..." : "Select a product"} />
              </SelectTrigger>
              <SelectContent>
                {filteredProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name as string}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedProductId ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Product-Specific Specifications</h3>
              <p className="text-sm text-muted-foreground">
                Managed options: <span className="font-medium text-foreground">{options.length}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Option name (e.g. Material)" 
                className="w-full sm:w-64"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
              />
              <Button 
                onClick={handleAddOption} 
                disabled={isAddingOption}
                variant={!newOptionName.trim() ? "secondary" : "default"}
              >
                {isAddingOption ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4 mr-2" />}
                Add Option
              </Button>
            </div>
          </div>

          {isLoadingOptions ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : options.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/30">
              <Lightbulb className="mx-auto size-12 text-muted-foreground/40 mb-4" />
              <h4 className="font-medium">No specific options defined yet</h4>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                Add options like &quot;Material&quot;, &quot;Sole Type&quot;, or &quot;Fit&quot; to provide more detail for this product&apos;s variants.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {options.map((option) => (
                <Card key={option.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{option.name}</CardTitle>
                        <CardDescription>Option ID: {option.id.slice(0, 8)}...</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteOption(option.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((val) => (
                        <Badge 
                          key={val.id} 
                          variant="secondary" 
                          className="px-3 py-1 group flex items-center gap-2"
                        >
                          {val.value}
                          <button 
                            onClick={() => handleDeleteValue(val.id)}
                            className="hover:text-destructive transition-colors"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </Badge>
                      ))}
                      {option.values.length === 0 && (
                        <span className="text-sm text-muted-foreground italic">No values added yet.</span>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Add value (e.g. Cotton)" 
                        value={newOptionValues[option.id] || ""}
                        onChange={(e) => setNewOptionValues(prev => ({ ...prev, [option.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && handleAddValue(option.id)}
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleAddValue(option.id)}
                        disabled={!newOptionValues[option.id]?.trim()}
                      >
                        <PlusCircle className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/10 opacity-60">
          <ChevronRight className="mx-auto size-12 text-muted-foreground/40 mb-4" />
          <h4 className="font-medium text-lg">Select a product to continue</h4>
          <p className="text-sm text-muted-foreground">
            You need to choose a product first to manage its specific options.
          </p>
        </div>
      )}
    </div>
  );
}
