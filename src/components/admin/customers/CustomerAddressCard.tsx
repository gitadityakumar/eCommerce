'use client';

import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Address {
  id: string;
  type: 'billing' | 'shipping';
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

interface CustomerAddressCardProps {
  addresses: Address[];
}

export function CustomerAddressCard({ addresses }: CustomerAddressCardProps) {
  if (addresses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Addresses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No addresses found for this customer.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Addresses
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {addresses.map(address => (
          <div
            key={address.id}
            className="p-4 rounded-lg border relative group hover:border-primary transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <Badge variant="outline" className="capitalize">
                {address.type}
              </Badge>
              {address.isDefault && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
                  Default
                  {' '}
                  {address.type === 'shipping' ? 'Shipping' : 'Billing'}
                </Badge>
              )}
            </div>
            <div className="text-sm space-y-1">
              <p className="font-medium">{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>
                {address.city}
                ,
                {' '}
                {address.state}
                {' '}
                {address.postalCode}
              </p>
              <p className="text-muted-foreground">{address.country}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
