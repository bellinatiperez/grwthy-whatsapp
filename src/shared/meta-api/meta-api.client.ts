import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import * as FormData from 'form-data';
import {
  MetaSendMessagePayload,
  MetaSendMessageResponse,
  MetaMediaUrlResponse,
  MetaMediaUploadResponse,
  MetaTemplateListResponse,
  MetaCreateTemplatePayload,
  MetaCreateTemplateResponse,
  MetaBusinessProfilePayload,
  MetaApiErrorResponse,
} from './meta-api.types';

@Injectable()
export class MetaApiClient {
  private readonly logger = new Logger(MetaApiClient.name);
  private readonly baseUrl: string;
  private readonly version: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('meta.url')!;
    this.version = this.configService.get<string>('meta.version')!;
  }

  private buildUrl(...segments: string[]): string {
    return [this.baseUrl, this.version, ...segments].join('/');
  }

  private buildHeaders(accessToken: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
  }

  private handleError(error: AxiosError<MetaApiErrorResponse>, context: string): never {
    const metaError = error.response?.data?.error;
    const message = metaError
      ? `Meta API error [${context}]: ${metaError.message} (code: ${metaError.code})`
      : `Meta API request failed [${context}]: ${error.message}`;
    this.logger.error(message);
    throw new Error(message);
  }

  async sendMessage(
    phoneNumberId: string,
    accessToken: string,
    payload: MetaSendMessagePayload,
  ): Promise<MetaSendMessageResponse> {
    try {
      const url = this.buildUrl(phoneNumberId, 'messages');
      const headers = this.buildHeaders(accessToken);
      const { data } = await axios.post<MetaSendMessageResponse>(url, payload, { headers });
      return data;
    } catch (error) {
      this.handleError(error as AxiosError<MetaApiErrorResponse>, 'sendMessage');
    }
  }

  async uploadMedia(
    phoneNumberId: string,
    accessToken: string,
    formData: FormData,
  ): Promise<MetaMediaUploadResponse> {
    try {
      const url = this.buildUrl(phoneNumberId, 'media');
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        ...formData.getHeaders(),
      };
      const { data } = await axios.post<MetaMediaUploadResponse>(url, formData, { headers });
      return data;
    } catch (error) {
      this.handleError(error as AxiosError<MetaApiErrorResponse>, 'uploadMedia');
    }
  }

  async getMediaUrl(mediaId: string, accessToken: string): Promise<MetaMediaUrlResponse> {
    try {
      const url = this.buildUrl(mediaId);
      const headers = this.buildHeaders(accessToken);
      const { data } = await axios.get<MetaMediaUrlResponse>(url, { headers });
      return data;
    } catch (error) {
      this.handleError(error as AxiosError<MetaApiErrorResponse>, 'getMediaUrl');
    }
  }

  async downloadMedia(mediaUrl: string, accessToken: string): Promise<Buffer> {
    try {
      const { data } = await axios.get(mediaUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'arraybuffer',
      });
      return Buffer.from(data);
    } catch (error) {
      this.handleError(error as AxiosError<MetaApiErrorResponse>, 'downloadMedia');
    }
  }

  async listTemplates(businessAccountId: string, accessToken: string): Promise<MetaTemplateListResponse> {
    try {
      const url = this.buildUrl(businessAccountId, 'message_templates');
      const headers = this.buildHeaders(accessToken);
      const { data } = await axios.get<MetaTemplateListResponse>(url, { headers });
      return data;
    } catch (error) {
      this.handleError(error as AxiosError<MetaApiErrorResponse>, 'listTemplates');
    }
  }

  async createTemplate(
    businessAccountId: string,
    accessToken: string,
    payload: MetaCreateTemplatePayload,
  ): Promise<MetaCreateTemplateResponse> {
    try {
      const url = this.buildUrl(businessAccountId, 'message_templates');
      const headers = this.buildHeaders(accessToken);
      const { data } = await axios.post<MetaCreateTemplateResponse>(url, payload, { headers });
      return data;
    } catch (error) {
      this.handleError(error as AxiosError<MetaApiErrorResponse>, 'createTemplate');
    }
  }

  async editTemplate(templateId: string, accessToken: string, payload: Record<string, any>): Promise<any> {
    try {
      const url = this.buildUrl(templateId);
      const headers = this.buildHeaders(accessToken);
      const { data } = await axios.post(url, payload, { headers });
      return data;
    } catch (error) {
      this.handleError(error as AxiosError<MetaApiErrorResponse>, 'editTemplate');
    }
  }

  async deleteTemplate(
    businessAccountId: string,
    accessToken: string,
    params: { name: string; hsm_id?: string },
  ): Promise<any> {
    try {
      const url = this.buildUrl(businessAccountId, 'message_templates');
      const headers = this.buildHeaders(accessToken);
      const { data } = await axios.delete(url, { headers, params });
      return data;
    } catch (error) {
      this.handleError(error as AxiosError<MetaApiErrorResponse>, 'deleteTemplate');
    }
  }

  async updateBusinessProfile(
    phoneNumberId: string,
    accessToken: string,
    payload: MetaBusinessProfilePayload,
  ): Promise<any> {
    try {
      const url = this.buildUrl(phoneNumberId, 'whatsapp_business_profile');
      const headers = this.buildHeaders(accessToken);
      const { data } = await axios.post(url, payload, { headers });
      return data;
    } catch (error) {
      this.handleError(error as AxiosError<MetaApiErrorResponse>, 'updateBusinessProfile');
    }
  }
}
