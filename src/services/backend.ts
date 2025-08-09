import axios from 'axios';
import { API_BASE_URL } from '../constants';

export type Province = {
  province_id: string;
  province: string;
};

export type City = {
  city_id: string;
  province_id: string;
  province: string;
  type: string; // City/ Kabupaten
  city_name: string;
  postal_code: string;
};

export type CostRequest = {
  origin: string | number;
  destination: string | number;
  weight: number; // grams
  courier: 'jne' | 'pos' | 'tiki';
};

export type ShippingCostResponse = {
  results: Array<{
    code: string;
    name: string;
    costs: Array<{
      service: string;
      description: string;
      cost: Array<{ value: number; etd: string; note: string }>
    }>
  }>
};

const client = axios.create({ baseURL: API_BASE_URL });

export async function getProvinces(): Promise<Province[]> {
  const { data } = await client.get('/api/provinces');
  return data?.data ?? [];
}

export async function getCities(params?: { province?: string; q?: string }): Promise<City[]> {
  const { data } = await client.get('/api/cities', { params });
  return data?.data ?? [];
}

export async function getCosts(body: CostRequest): Promise<ShippingCostResponse> {
  const { data } = await client.post('/api/cost', body);
  return data;
}
