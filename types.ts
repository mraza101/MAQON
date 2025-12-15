import { LucideIcon } from 'lucide-react';

export interface Service {
  id: string;
  title: string;
  tagline: string;
  duration: string;
  priceStart: string;
  icon: LucideIcon;
  target: string;
  description: string;
  deliverables: string[];
  path: string;
}

export interface TeamMember {
  name: string;
  role: string;
  identity: string; // e.g. "VC/PE Operator"
  bio: string; // Short intro
  bullets: string[]; // Proof points
  linkedin: string;
}

export interface Location {
  city: string;
  country: string;
  desc: string;
  address: string;
  phone: string;
  email: string;
}