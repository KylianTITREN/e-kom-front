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

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string | null;
  description: RichTextBlock[] | string;
  price: number;
  images?: StrapiImage[];
  ageRestricted?: boolean;
  category?: string;
  subCategory?: string;
  brand?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface News {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: RichTextBlock[] | string;
  image?: StrapiImage;
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface LegalPage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: RichTextBlock[] | string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
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
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  ageRestricted?: boolean;
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
