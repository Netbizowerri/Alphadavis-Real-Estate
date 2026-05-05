/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  tag: string;
  description?: string;
  features?: string[];
  state?: string;
  city?: string;
  neighborhood?: string;
  coverImageUrl?: string;
  priceLabel?: string;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  floorAreaSqm?: number;
  amenities?: string[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  image: string;
  phone: string;
  email: string;
}
