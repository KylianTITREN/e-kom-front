export interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large?: ImageFormat;
    medium?: ImageFormat;
    small?: ImageFormat;
    thumbnail?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface RichTextBlock {
  type: string;
  children: Array<{
    text: string;
    type: string;
    bold?: boolean;
    italic?: boolean;
  }>;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  brands?: Brand[];
  subCategories?: SubCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  category?: Category;
  brands?: Brand[];
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  categories?: Category[];
  subCategories?: SubCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface Engraving {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  price: number;
  allowText: boolean;
  textMaxLength: number;
  allowLogo: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string | null;
  description: RichTextBlock[] | string;
  price: number;
  images?: StrapiImage[];
  ageRestricted?: boolean;
  isPromo?: boolean;
  limitedEdition?: boolean;
  endOfSeries?: boolean;
  engravings?: Engraving[];
  category?: Category;
  subCategory?: SubCategory;
  brand?: Brand;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface News {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: RichTextBlock[] | string;
  image?: StrapiImage;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface LegalPage {
  id: number;
  documentId: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  slug: string;
  content: RichTextBlock[] | string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface HomepageContent {
  id: number;
  documentId: string;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  welcomeTitle: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  welcomeText: RichTextBlock[] | string;
  featuredSectionTitle: string;
  newsSectionTitle: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Settings {
  id: number;
  documentId: string;
  siteName: string;
  siteEmail: string;
  contactPhone?: string;
  logo?: StrapiImage;
  favicon?: StrapiImage;
  stripePublicKey: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  googleAnalyticsId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Types pour le panier
export interface EngravingData {
  type: string;
  label: string;
  price: number;
  text?: string;
  logoUrl?: string;
}

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  ageRestricted?: boolean;
  engraving?: EngravingData;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  hasAgeRestrictedItems: boolean;
}

// Types pour les tarifs de livraison
export interface ShippingRate {
  id: string;
  displayName: string;
  type: string;
  fixedAmount: {
    amount: number;
    currency: string;
  } | null;
  freeShippingThreshold: number | null;
  showUnder: number | null;
  deliveryEstimate: {
    minimum: any;
    maximum: any;
  } | null;
  metadata: Record<string, string>;
}
