import axios from 'axios';
import { RAJA_ONGKIR_BASE, RAJA_ONGKIR_KEY } from '../constants';

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

const client = axios.create({
  baseURL: RAJA_ONGKIR_BASE,
  headers: { key: RAJA_ONGKIR_KEY },
});

export async function getProvinces(): Promise<Province[]> {
  const { data } = await client.get('/province');
  return data?.rajaongkir?.results ?? [];
}

export async function getCities(params?: { province?: string; q?: string }): Promise<City[]> {
  // If q provided, we fetch all and filter locally (Starter has no search). Otherwise by province.
  if (params?.q) {
    const all = await getAllCities();
    const q = params.q.toLowerCase();
    return all.filter(
      (c) => `${c.type} ${c.city_name} ${c.province}`.toLowerCase().includes(q)
    ).slice(0, 20);
  }
  const { data } = await client.get('/city', { params: { province: params?.province } });
  return data?.rajaongkir?.results ?? [];
}

let cachedAllCities: City[] | null = null;
async function getAllCities(): Promise<City[]> {
  if (cachedAllCities) return cachedAllCities;
  const { data } = await client.get('/city');
  cachedAllCities = data?.rajaongkir?.results ?? [];
  return cachedAllCities ?? [];
}

export async function getCosts(body: CostRequest): Promise<ShippingCostResponse> {
  const form = new URLSearchParams({
    origin: String(body.origin),
    destination: String(body.destination),
    weight: String(body.weight),
    courier: body.courier,
  }).toString();
  const { data } = await client.post('/cost', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data?.rajaongkir ?? { results: [] };
}
