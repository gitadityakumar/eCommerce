"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconPlus, IconTrash, IconCirclePlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createProduct, type CreateProductInput } from "@/actions/products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  id: string
  name: string
}

interface Brand {
  id: string
  name: string
}

interface Gender {
  id: string
  label: string
}

interface Color {
  id: string
  name: string
  hexCode: string
}

interface Size {
  id: string
  name: string
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  categoryId: z.string().min(1, "Category is required."),
  brandId: z.string().min(1, "Brand is required."),
  genderId: z.string().min(1, "Gender is required."),
  status: z.enum(["draft", "published", "archived"]),
  images: z.array(z.object({
    url: z.string().url("Invalid image URL"),
    isPrimary: z.boolean(),
  })).min(1, "At least one image is required"),
  variants: z.array(z.object({
    sku: z.string().min(1, "SKU is required"),
    price: z.string().min(1, "Price is required"),
    salePrice: z.string().optional().nullable(),
    weight: z.number().optional().nullable(),

    colorId: z.string().uuid().optional().nullable(),
    sizeId: z.string().uuid().optional().nullable(),
    dimensions: z
      .object({
        length: z.number(),
        width: z.number(),
        height: z.number(),
      })
      .partial()
      .optional()
      .nullable(),
  })).min(1, "At least one variant is required"),
})

type FormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  categories: Category[]
  brands: Brand[]
  genders: Gender[]
  colors: Color[]
  sizes: Size[]
}

export function ProductForm({ categories, brands, genders, colors, sizes }: ProductFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      categoryId: "",
      brandId: "",
      genderId: "",
      status: "draft",
      images: [{ url: "", isPrimary: true }],
      variants: [{
        sku: "",
        price: "",
        salePrice: null,
        weight: null,

        colorId: null,
        sizeId: null,
        dimensions: null
      }],
    },
  })

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    name: "images",
    control: form.control,
  })

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    name: "variants",
    control: form.control,
  })

  async function onSubmit(values: FormValues) {
    console.log("onSubmit started with values:", values)
    // @ts-expect-error - Debugging form submission
    window.submitStarted = true
    setIsPending(true)
    
    // Map "none" string back to null for database
    const submitValues = {
      ...values,
      variants: values.variants.map(v => ({
        ...v,
        colorId: v.colorId === "none" ? null : v.colorId,
        sizeId: v.sizeId === "none" ? null : v.sizeId,
      }))
    }

    console.log("Calling createProduct server action...")
    try {
      const result = await createProduct(submitValues as CreateProductInput)
      console.log("createProduct result:", result)
      // @ts-expect-error - Debugging form submission result
      window.lastSubmitResult = result
      setIsPending(false)

      if (result.success) {
        toast.success("Product created successfully")
        router.push("/admin/products")
      } else {
        toast.error(result.error || "Failed to create product")
      }
    } catch (error) {
      console.error("Error calling createProduct:", error)
      toast.error("An unexpected error occurred")
      setIsPending(false)
    }
  }

  // Auto-generate slug from name
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name" && value.name) {
        const slug = value.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
        form.setValue("slug", slug, { shouldValidate: true })
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  return (
    <div className="px-4 lg:px-6 pb-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="inventory">Inventory & Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>All the standard details for your product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Nike Air Max 270" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="nike-air-max-270" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="The Nike Air Max 270 is inspired by two icons..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="genderId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {genders.map((g) => (
                                <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Media</CardTitle>
                  <CardDescription>Add images for your product. The first one will be the primary image.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {imageFields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end">
                      <FormField
                        control={form.control}
                        name={`images.${index}.url`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className={index !== 0 ? "sr-only" : ""}>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`images.${index}.isPrimary`}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 mb-2">
                             <FormControl>
                               <input 
                                 type="checkbox" 
                                 checked={field.value} 
                                 onChange={field.onChange}
                                 className="size-4"
                               />
                             </FormControl>
                             <FormLabel className="mt-0! text-sm">Primary</FormLabel>
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeImage(index)}
                        disabled={imageFields.length === 1}
                        className="mb-1"
                      >
                        <IconTrash className="size-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => appendImage({ url: "", isPrimary: false })}
                  >
                    <IconPlus className="mr-2 size-4" />
                    Add Image URL
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Variants</CardTitle>
                    <CardDescription>Manage SKUs, pricing, and stock for each variation.</CardDescription>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => appendVariant({ 
                      sku: "", 
                      price: "", 
                      salePrice: null, 
                      weight: null, 
              
                      colorId: null,
                      sizeId: null,
                      dimensions: null
                    })}
                  >
                    <IconCirclePlus className="mr-2 size-4" />
                    Add Variant
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {variantFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-lg relative">
                      {variantFields.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeVariant(index)}
                          className="absolute top-2 right-2"
                        >
                          <IconTrash className="size-4 text-destructive" />
                        </Button>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name={`variants.${index}.sku`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input placeholder="NIKE-AM270-BLK-9" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (INR)</FormLabel>
                              <FormControl>
                                <Input placeholder="9999.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.salePrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sale Price (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="7999.00" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`variants.${index}.colorId`}
                          render={({ field }) => (
                              <FormItem>
                            <FormLabel>Color (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select color" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  {colors.map((color) => (
                                    <SelectItem key={color.id} value={color.id}>
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="size-4 rounded-full border" 
                                          style={{ backgroundColor: color.hexCode }} 
                                        />
                                        {color.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.sizeId`}
                          render={({ field }) => (
                              <FormItem>
                            <FormLabel>Size (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                   <SelectItem value="none">None</SelectItem>
                                  {sizes.map((size) => (
                                    <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                         <FormField
                          control={form.control}
                          name={`variants.${index}.weight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (kg) (Optional)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} value={field.value ?? ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.dimensions.length`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Length (Optional)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} value={field.value ?? ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.dimensions.width`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Width (Optional)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} value={field.value ?? ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`variants.${index}.dimensions.height`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (Optional)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} value={field.value ?? ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
