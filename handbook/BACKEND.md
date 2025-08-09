# Backend integration

Set these env vars in the app:
- API_BASE_URL (e.g., http://localhost:8000 or https://api.example.com)

# Laravel backend spec (compact)

Routes (routes/api.php):
- GET /api/provinces
- GET /api/cities?province=&q=
- POST /api/cost { origin, destination, weight, courier }

Validation (FormRequest):
- CitiesRequest: province: sometimes|string; q: sometimes|string|min:2
- CostRequest: origin: required|string; destination: required|string; weight: required|integer|min:1; courier: required|in:jne,pos,tiki

Controller (App/Http/Controllers/RajaOngkirController.php):
- provinces(): cache+proxy GET /province
- cities(CitiesRequest): cache+proxy GET /city with params
- cost(CostRequest): cache+proxy POST /cost

Service (App/Services/RajaOngkirClient.php):
- base: env('RAJAONGKIR_BASE', 'https://api.rajaongkir.com/starter')
- header: key: env('RAJAONGKIR_KEY')
- use Http::withHeaders()->get/post

Caching (Cache::remember):
- provinces: 1 day; cities: 1 day keyed by province/q; cost: 10 min keyed by origin-destination-weight-courier

Env (.env) on backend:
- RAJAONGKIR_KEY=
- RAJAONGKIR_BASE=https://api.rajaongkir.com/starter

CORS: allow your app origins.

Rate limit: 60/min per IP.
