import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProvinces, getCities, getCosts, type City, type Province, type CostRequest, type ShippingCostResponse } from '../api/rajaOngkir';

const debounce = (fn: (...args: any[]) => void, delay = 400) => {
  let t: NodeJS.Timeout | undefined;
  return (...args: any[]) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

export default function Home() {
  const [_provinces, setProvinces] = useState<Province[]>([]);
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [originCity, setOriginCity] = useState<City | null>(null);
  const [destCity, setDestCity] = useState<City | null>(null);
  const [weight, setWeight] = useState('1000');
  const [courier, setCourier] = useState<'jne' | 'pos' | 'tiki'>('jne');
  const [originResults, setOriginResults] = useState<City[]>([]);
  const [destResults, setDestResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [costs, setCosts] = useState<ShippingCostResponse['results']>([]);

  useEffect(() => {
    getProvinces().then(setProvinces).catch(() => {});
  }, []);

  const searchOrigin = React.useMemo(
    () =>
      debounce(async (q: string) => {
        if (!q) return setOriginResults([]);
        try {
          const list = await getCities({ q });
          setOriginResults(list);
        } catch (e) {}
      }, 400),
    []
  );
  const searchDest = React.useMemo(
    () =>
      debounce(async (q: string) => {
        if (!q) return setDestResults([]);
        try {
          const list = await getCities({ q });
          setDestResults(list);
        } catch (e) {}
      }, 400),
    []
  );

  const onCheck = async () => {
    if (!originCity || !destCity) return;
    setLoading(true);
    setError(null);
    try {
      const payload: CostRequest = {
        origin: originCity.city_id,
        destination: destCity.city_id,
        weight: Number(weight) || 0,
        courier,
      };
      const res = await getCosts(payload);
      setCosts(res.results);
    } catch (e: any) {
      setError(e?.message ?? 'Gagal mengambil ongkir');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 gap-4">
        <Text className="text-2xl font-bold">Golek Ongkir</Text>

        <View>
          <Text className="font-semibold mb-2">Asal</Text>
          <TextInput
            placeholder="Cari kota asal..."
            value={originQuery}
            onChangeText={(t) => {
              setOriginQuery(t);
              searchOrigin(t);
              setOriginCity(null);
            }}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {originResults.length > 0 && !originCity && (
            <FlatList
              data={originResults}
              keyExtractor={(item) => item.city_id}
              className="max-h-48 border border-gray-200 rounded mt-2"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setOriginCity(item);
                    setOriginQuery(`${item.type} ${item.city_name}, ${item.province}`);
                    setOriginResults([]);
                  }}
                  className="px-3 py-2 border-b border-gray-100"
                >
                  <Text>{item.type} {item.city_name}, {item.province}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View>
          <Text className="font-semibold mb-2">Tujuan</Text>
          <TextInput
            placeholder="Cari kota tujuan..."
            value={destQuery}
            onChangeText={(t) => {
              setDestQuery(t);
              searchDest(t);
              setDestCity(null);
            }}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {destResults.length > 0 && !destCity && (
            <FlatList
              data={destResults}
              keyExtractor={(item) => item.city_id}
              className="max-h-48 border border-gray-200 rounded mt-2"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setDestCity(item);
                    setDestQuery(`${item.type} ${item.city_name}, ${item.province}`);
                    setDestResults([]);
                  }}
                  className="px-3 py-2 border-b border-gray-100"
                >
                  <Text>{item.type} {item.city_name}, {item.province}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View className="flex-row gap-2">
          <View className="flex-1">
            <Text className="font-semibold mb-2">Berat (gram)</Text>
            <TextInput
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </View>
          <View className="w-28">
            <Text className="font-semibold mb-2">Kurir</Text>
            <TextInput
              value={courier}
              onChangeText={(t) => setCourier((t as any) || 'jne')}
              placeholder="jne/pos/tiki"
              className="border border-gray-300 rounded px-3 py-2"
            />
          </View>
        </View>

        <TouchableOpacity onPress={onCheck} className="bg-black rounded py-3 items-center">
          <Text className="text-white font-semibold">Cek Ongkir</Text>
        </TouchableOpacity>

        {loading && (
          <View className="flex-row items-center gap-2">
            <ActivityIndicator />
            <Text>Mengambil data...</Text>
          </View>
        )}
        {error && <Text className="text-red-600">{error}</Text>}

        {costs.map((r) => (
          <View key={r.code} className="mt-4">
            <Text className="font-bold uppercase">{r.code}</Text>
            {r.costs.map((c) => (
              <View key={c.service} className="border border-gray-200 rounded p-3 mt-2">
                <Text className="font-semibold">{c.service} - {c.description}</Text>
                {c.cost.map((co, idx) => (
                  <Text key={idx}>
                    Rp {co.value.toLocaleString('id-ID')} • Estimasi {co.etd} hari
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
