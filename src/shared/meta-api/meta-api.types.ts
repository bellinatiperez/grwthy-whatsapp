export interface MetaSendMessagePayload {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  type: string;
  to: string;
  [key: string]: any;
}

export interface MetaSendMessageResponse {
  messaging_product: string;
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string; message_status?: string }>;
}

export interface MetaMediaUrlResponse {
  url: string;
  mime_type: string;
  sha256: string;
  file_size: number;
  id: string;
  messaging_product: string;
}

export interface MetaMediaUploadResponse {
  id: string;
}

export interface MetaTemplateListResponse {
  data: MetaTemplateItem[];
  paging?: { cursors: { before: string; after: string }; next?: string };
}

export interface MetaTemplateItem {
  name: string;
  components: any[];
  language: string;
  status: string;
  category: string;
  id: string;
}

export interface MetaCreateTemplatePayload {
  name: string;
  category: string;
  allow_category_change?: boolean;
  language: string;
  components: any[];
}

export interface MetaCreateTemplateResponse {
  id: string;
  status: string;
  category: string;
}

export interface MetaBusinessProfilePayload {
  messaging_product: 'whatsapp';
  about?: string;
  address?: string;
  description?: string;
  vertical?: string;
  email?: string;
  websites?: string[];
  profile_picture_handle?: string;
}

export interface MetaApiErrorResponse {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}
