import type { ReactNode } from "react";
import {
  CreditCard,
  Package,
  Truck,
  MessageSquare,
  Fingerprint,
} from "lucide-react";
import type { EvidenceCategory } from "../types";

export const CATEGORY_ICON: Record<EvidenceCategory, ReactNode> = {
  Transaction: <CreditCard className="h-4 w-4" />,
  Order: <Package className="h-4 w-4" />,
  Delivery: <Truck className="h-4 w-4" />,
  "Customer Communication": <MessageSquare className="h-4 w-4" />,
  "Device & Payment Signals": <Fingerprint className="h-4 w-4" />,
};
