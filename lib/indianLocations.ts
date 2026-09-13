export interface IndianCity { name: string; latitude: number; longitude: number; timezone?: string; }
export interface IndianState { state: string; cities: IndianCity[]; }

export const INDIAN_LOCATIONS: IndianState[] = [
  { state: 'Himachal Pradesh', cities: [ { name: 'Shimla', latitude: 31.1048, longitude: 77.1734, timezone: 'Asia/Kolkata' }, { name: 'Manali', latitude: 32.2432, longitude: 77.1892, timezone: 'Asia/Kolkata' }, { name: 'Dharamshala', latitude: 32.219, longitude: 76.3234, timezone: 'Asia/Kolkata' }, { name: 'Kullu', latitude: 31.9578, longitude: 77.1095, timezone: 'Asia/Kolkata' }, { name: 'Mandi', latitude: 31.7099, longitude: 76.9328, timezone: 'Asia/Kolkata' }, { name: 'Solan', latitude: 30.9045, longitude: 77.0967, timezone: 'Asia/Kolkata' } ] },
  { state: 'Uttarakhand', cities: [ { name: 'Dehradun', latitude: 30.3165, longitude: 78.0322, timezone: 'Asia/Kolkata' }, { name: 'Mussoorie', latitude: 30.4598, longitude: 78.0664, timezone: 'Asia/Kolkata' }, { name: 'Nainital', latitude: 29.3919, longitude: 79.4542, timezone: 'Asia/Kolkata' }, { name: 'Haridwar', latitude: 29.9457, longitude: 78.1642, timezone: 'Asia/Kolkata' }, { name: 'Rishikesh', latitude: 30.0869, longitude: 78.2676, timezone: 'Asia/Kolkata' }, { name: 'Almora', latitude: 29.6167, longitude: 79.667, timezone: 'Asia/Kolkata' }, { name: 'Haldwani', latitude: 29.2183, longitude: 79.5286, timezone: 'Asia/Kolkata' } ] },
  { state: 'Sikkim', cities: [ { name: 'Gangtok', latitude: 27.3389, longitude: 88.6065, timezone: 'Asia/Kolkata' } ] },
  { state: 'Assam', cities: [ { name: 'Guwahati', latitude: 26.1445, longitude: 91.7362, timezone: 'Asia/Kolkata' }, { name: 'Dibrugarh', latitude: 27.4728, longitude: 94.912, timezone: 'Asia/Kolkata' }, { name: 'Silchar', latitude: 24.8333, longitude: 92.7789, timezone: 'Asia/Kolkata' } ] },
  { state: 'Meghalaya', cities: [ { name: 'Shillong', latitude: 25.5788, longitude: 91.8933, timezone: 'Asia/Kolkata' }, { name: 'Cherrapunji', latitude: 25.2702, longitude: 91.7323, timezone: 'Asia/Kolkata' } ] },
  { state: 'Arunachal Pradesh', cities: [ { name: 'Itanagar', latitude: 27.0844, longitude: 93.6053, timezone: 'Asia/Kolkata' }, { name: 'Tawang', latitude: 27.586, longitude: 91.8594, timezone: 'Asia/Kolkata' } ] },
  { state: 'Nagaland', cities: [ { name: 'Kohima', latitude: 25.6751, longitude: 94.1086, timezone: 'Asia/Kolkata' } ] },
  { state: 'Manipur', cities: [ { name: 'Imphal', latitude: 24.817, longitude: 93.9368, timezone: 'Asia/Kolkata' } ] },
  { state: 'Mizoram', cities: [ { name: 'Aizawl', latitude: 23.7271, longitude: 92.7176, timezone: 'Asia/Kolkata' } ] },
  { state: 'Tripura', cities: [ { name: 'Agartala', latitude: 23.8315, longitude: 91.2868, timezone: 'Asia/Kolkata' } ] },
  { state: 'Jammu and Kashmir', cities: [ { name: 'Srinagar', latitude: 34.0837, longitude: 74.7973, timezone: 'Asia/Kolkata' }, { name: 'Jammu', latitude: 32.7266, longitude: 74.857, timezone: 'Asia/Kolkata' }, { name: 'Gulmarg', latitude: 34.0484, longitude: 74.3805, timezone: 'Asia/Kolkata' }, { name: 'Pahalgam', latitude: 34.0162, longitude: 75.3315, timezone: 'Asia/Kolkata' } ] },
  { state: 'Ladakh', cities: [ { name: 'Leh', latitude: 34.1526, longitude: 77.5771, timezone: 'Asia/Kolkata' } ] },
  { state: 'Delhi', cities: [ { name: 'New Delhi', latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' }, { name: 'Delhi', latitude: 28.7041, longitude: 77.1025, timezone: 'Asia/Kolkata' } ] },
  { state: 'Maharashtra', cities: [ { name: 'Mumbai', latitude: 19.076, longitude: 72.8777, timezone: 'Asia/Kolkata' }, { name: 'Pune', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata' }, { name: 'Nagpur', latitude: 21.1458, longitude: 79.0882, timezone: 'Asia/Kolkata' }, { name: 'Nashik', latitude: 19.9975, longitude: 73.7898, timezone: 'Asia/Kolkata' }, { name: 'Aurangabad', latitude: 19.8762, longitude: 75.3433, timezone: 'Asia/Kolkata' } ] },
  { state: 'Karnataka', cities: [ { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' }, { name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' }, { name: 'Mysore', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata' }, { name: 'Mangalore', latitude: 12.9141, longitude: 74.856, timezone: 'Asia/Kolkata' }, { name: 'Hubli', latitude: 15.3647, longitude: 75.124, timezone: 'Asia/Kolkata' } ] },
  { state: 'Tamil Nadu', cities: [ { name: 'Chennai', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' }, { name: 'Coimbatore', latitude: 11.0168, longitude: 76.9558, timezone: 'Asia/Kolkata' }, { name: 'Madurai', latitude: 9.9252, longitude: 78.1198, timezone: 'Asia/Kolkata' }, { name: 'Ooty', latitude: 11.4102, longitude: 76.695, timezone: 'Asia/Kolkata' }, { name: 'Kanyakumari', latitude: 8.0883, longitude: 77.5385, timezone: 'Asia/Kolkata' } ] },
  { state: 'Kerala', cities: [ { name: 'Thiruvananthapuram', latitude: 8.5241, longitude: 76.9366, timezone: 'Asia/Kolkata' }, { name: 'Kochi', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata' }, { name: 'Kozhikode', latitude: 11.2541, longitude: 75.7804, timezone: 'Asia/Kolkata' }, { name: 'Munnar', latitude: 10.0889, longitude: 77.0595, timezone: 'Asia/Kolkata' } ] },
  { state: 'West Bengal', cities: [ { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' }, { name: 'Darjeeling', latitude: 27.036, longitude: 88.2627, timezone: 'Asia/Kolkata' }, { name: 'Siliguri', latitude: 26.7271, longitude: 88.3953, timezone: 'Asia/Kolkata' } ] },
  { state: 'Rajasthan', cities: [ { name: 'Jaipur', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata' }, { name: 'Jodhpur', latitude: 26.2389, longitude: 73.0243, timezone: 'Asia/Kolkata' }, { name: 'Udaipur', latitude: 24.5854, longitude: 73.7125, timezone: 'Asia/Kolkata' }, { name: 'Jaisalmer', latitude: 26.9157, longitude: 70.9083, timezone: 'Asia/Kolkata' }, { name: 'Mount Abu', latitude: 24.5926, longitude: 72.7156, timezone: 'Asia/Kolkata' } ] },
  { state: 'Uttar Pradesh', cities: [ { name: 'Lucknow', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata' }, { name: 'Varanasi', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata' }, { name: 'Agra', latitude: 27.1767, longitude: 78.0081, timezone: 'Asia/Kolkata' }, { name: 'Kanpur', latitude: 26.4499, longitude: 80.3319, timezone: 'Asia/Kolkata' }, { name: 'Prayagraj', latitude: 25.4358, longitude: 81.8463, timezone: 'Asia/Kolkata' } ] },
  { state: 'Gujarat', cities: [ { name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' }, { name: 'Surat', latitude: 21.1702, longitude: 72.8311, timezone: 'Asia/Kolkata' }, { name: 'Vadodara', latitude: 22.3072, longitude: 73.1812, timezone: 'Asia/Kolkata' }, { name: 'Kutch', latitude: 23.7337, longitude: 69.8597, timezone: 'Asia/Kolkata' } ] },
  { state: 'Punjab', cities: [ { name: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, timezone: 'Asia/Kolkata' }, { name: 'Amritsar', latitude: 31.634, longitude: 74.8723, timezone: 'Asia/Kolkata' }, { name: 'Ludhiana', latitude: 30.901, longitude: 75.8573, timezone: 'Asia/Kolkata' } ] },
  { state: 'Haryana', cities: [ { name: 'Gurugram', latitude: 28.4595, longitude: 77.0266, timezone: 'Asia/Kolkata' }, { name: 'Faridabad', latitude: 28.4089, longitude: 77.3178, timezone: 'Asia/Kolkata' }, { name: 'Panipat', latitude: 29.3909, longitude: 76.9635, timezone: 'Asia/Kolkata' }, { name: 'Ambala', latitude: 30.3782, longitude: 76.7767, timezone: 'Asia/Kolkata' }, { name: 'Karnal', latitude: 29.6857, longitude: 76.9905, timezone: 'Asia/Kolkata' } ] },
  { state: 'Bihar', cities: [ { name: 'Patna', latitude: 25.5941, longitude: 85.1376, timezone: 'Asia/Kolkata' }, { name: 'Gaya', latitude: 24.7914, longitude: 85.0002, timezone: 'Asia/Kolkata' }, { name: 'Bodh Gaya', latitude: 24.6961, longitude: 84.9911, timezone: 'Asia/Kolkata' } ] },
  { state: 'Odisha', cities: [ { name: 'Bhubaneswar', latitude: 20.2961, longitude: 85.8245, timezone: 'Asia/Kolkata' }, { name: 'Cuttack', latitude: 20.4625, longitude: 85.8828, timezone: 'Asia/Kolkata' }, { name: 'Puri', latitude: 19.8135, longitude: 85.8312, timezone: 'Asia/Kolkata' } ] },
  { state: 'Telangana', cities: [ { name: 'Hyderabad', latitude: 17.385, longitude: 78.4867, timezone: 'Asia/Kolkata' }, { name: 'Warangal', latitude: 17.9689, longitude: 79.5941, timezone: 'Asia/Kolkata' } ] },
  { state: 'Andhra Pradesh', cities: [ { name: 'Visakhapatnam', latitude: 17.6868, longitude: 83.2185, timezone: 'Asia/Kolkata' }, { name: 'Vijayawada', latitude: 16.5062, longitude: 80.648, timezone: 'Asia/Kolkata' }, { name: 'Tirupati', latitude: 13.6288, longitude: 79.4192, timezone: 'Asia/Kolkata' } ] },
  { state: 'Madhya Pradesh', cities: [ { name: 'Bhopal', latitude: 23.2599, longitude: 77.4126, timezone: 'Asia/Kolkata' }, { name: 'Indore', latitude: 22.7196, longitude: 75.8577, timezone: 'Asia/Kolkata' }, { name: 'Jabalpur', latitude: 23.1815, longitude: 79.9864, timezone: 'Asia/Kolkata' } ] },
  { state: 'Chhattisgarh', cities: [ { name: 'Raipur', latitude: 21.2514, longitude: 81.6296, timezone: 'Asia/Kolkata' } ] },
  { state: 'Jharkhand', cities: [ { name: 'Ranchi', latitude: 23.3441, longitude: 85.3096, timezone: 'Asia/Kolkata' }, { name: 'Jamshedpur', latitude: 22.8046, longitude: 86.2029, timezone: 'Asia/Kolkata' } ] },
  { state: 'Goa', cities: [ { name: 'Panaji', latitude: 15.4909, longitude: 73.8278, timezone: 'Asia/Kolkata' }, { name: 'Vasco da Gama', latitude: 15.3939, longitude: 73.8162, timezone: 'Asia/Kolkata' } ] },
];

export const POPULAR_LOCATIONS = [ { city: 'Shimla', state: 'Himachal Pradesh' }, { city: 'Manali', state: 'Himachal Pradesh' }, { city: 'Dehradun', state: 'Uttarakhand' }, { city: 'Nainital', state: 'Uttarakhand' }, { city: 'Gangtok', state: 'Sikkim' }, { city: 'Shillong', state: 'Meghalaya' }, { city: 'Guwahati', state: 'Assam' }, { city: 'Itanagar', state: 'Arunachal Pradesh' }, { city: 'New Delhi', state: 'Delhi' }, { city: 'Mumbai', state: 'Maharashtra' } ];

export interface CuratedLocation { city: string; state: string; country: string; latitude: number; longitude: number; timezone: string; }

export function findCuratedLocation(cityName: string, stateName?: string): CuratedLocation | null {
  const lowerCity = cityName.toLowerCase().trim(); const lowerState = stateName?.toLowerCase().trim();
  for (const stateData of INDIAN_LOCATIONS) {
    if (lowerState && !stateData.state.toLowerCase().includes(lowerState)) continue;
    for (const city of stateData.cities) {
      if (city.name.toLowerCase() === lowerCity) { return { city: city.name, state: stateData.state, country: 'India', latitude: city.latitude, longitude: city.longitude, timezone: city.timezone || 'Asia/Kolkata' }; }
    }
  }
  for (const stateData of INDIAN_LOCATIONS) {
    for (const city of stateData.cities) {
      if (city.name.toLowerCase() === lowerCity) { return { city: city.name, state: stateData.state, country: 'India', latitude: city.latitude, longitude: city.longitude, timezone: city.timezone || 'Asia/Kolkata' }; }
    }
  }
  return null;
}

export function searchCuratedLocations(query: string): CuratedLocation[] {
  const lower = query.toLowerCase().trim(); if (!lower) return [];
  const parts = lower.split(',').map((p) => p.trim()).filter(Boolean); const cityPart = parts[0] || lower; const statePart = parts[1];
  const results: CuratedLocation[] = []; const seen = new Set<string>();
  for (const stateData of INDIAN_LOCATIONS) {
    const stateMatches = statePart ? stateData.state.toLowerCase().includes(statePart) : stateData.state.toLowerCase().includes(lower);
    for (const city of stateData.cities) {
      const cityMatches = city.name.toLowerCase().includes(cityPart);
      if (cityMatches && (stateMatches || !statePart)) { const key = `${city.name}-${stateData.state}`; if (!seen.has(key)) { seen.add(key); results.push({ city: city.name, state: stateData.state, country: 'India', latitude: city.latitude, longitude: city.longitude, timezone: city.timezone || 'Asia/Kolkata' }); } }
    }
    if (stateMatches && !statePart) { for (const city of stateData.cities) { const key = `${city.name}-${stateData.state}`; if (!seen.has(key)) { seen.add(key); results.push({ city: city.name, state: stateData.state, country: 'India', latitude: city.latitude, longitude: city.longitude, timezone: city.timezone || 'Asia/Kolkata' }); } } }
  }
  return results.slice(0, 20);
}

export function getNearbyCuratedLocations(lat: number, lon: number, excludeCity?: string, maxResults: number = 5): CuratedLocation[] {
  const all: Array<CuratedLocation & { distance: number }> = [];
  for (const stateData of INDIAN_LOCATIONS) { for (const city of stateData.cities) { if (excludeCity && city.name.toLowerCase() === excludeCity.toLowerCase()) continue; const dist = Math.sqrt(Math.pow(city.latitude - lat, 2) + Math.pow(city.longitude - lon, 2)); all.push({ city: city.name, state: stateData.state, country: 'India', latitude: city.latitude, longitude: city.longitude, timezone: city.timezone || 'Asia/Kolkata', distance: dist }); } }
  all.sort((a, b) => a.distance - b.distance);
  return all.slice(0, maxResults).map(({ distance, ...loc }) => loc);
}

export function getAllStates(): string[] { return INDIAN_LOCATIONS.map((s) => s.state); }
export function getCitiesByState(stateName: string): IndianCity[] { const state = INDIAN_LOCATIONS.find((s) => s.state.toLowerCase() === stateName.toLowerCase()); return state?.cities || []; }

const STATE_ALIASES: Record<string, string> = { 'himachal': 'Himachal Pradesh', 'himachal pradesh': 'Himachal Pradesh', 'h.p.': 'Himachal Pradesh', 'hp': 'Himachal Pradesh', 'uttarakhand': 'Uttarakhand', 'uttrakhand': 'Uttarakhand', 'uttaranchal': 'Uttarakhand', 'uk': 'Uttarakhand', 'u.k.': 'Uttarakhand', 'sikkim': 'Sikkim', 'assam': 'Assam', 'meghalaya': 'Meghalaya', 'arunachal pradesh': 'Arunachal Pradesh', 'arunachal': 'Arunachal Pradesh', 'nagaland': 'Nagaland', 'manipur': 'Manipur', 'mizoram': 'Mizoram', 'tripura': 'Tripura', 'west bengal': 'West Bengal', 'bengal': 'West Bengal', 'delhi': 'Delhi', 'new delhi': 'Delhi', 'maharashtra': 'Maharashtra', 'karnataka': 'Karnataka', 'tamil nadu': 'Tamil Nadu', 'tamilnadu': 'Tamil Nadu', 'tn': 'Tamil Nadu', 'kerala': 'Kerala', 'rajasthan': 'Rajasthan', 'gujarat': 'Gujarat', 'uttar pradesh': 'Uttar Pradesh', 'up': 'Uttar Pradesh', 'u.p.': 'Uttar Pradesh', 'bihar': 'Bihar', 'odisha': 'Odisha', 'orissa': 'Odisha', 'telangana': 'Telangana', 'andhra pradesh': 'Andhra Pradesh', 'andhra': 'Andhra Pradesh', 'ap': 'Andhra Pradesh', 'madhya pradesh': 'Madhya Pradesh', 'mp': 'Madhya Pradesh', 'm.p.': 'Madhya Pradesh', 'chhattisgarh': 'Chhattisgarh', 'jharkhand': 'Jharkhand', 'goa': 'Goa', 'punjab': 'Punjab', 'haryana': 'Haryana', 'jammu and kashmir': 'Jammu and Kashmir', 'j&k': 'Jammu and Kashmir', 'jk': 'Jammu and Kashmir', 'kashmir': 'Jammu and Kashmir', 'ladakh': 'Ladakh' };
const CITY_ALIASES: Record<string, string> = { 'simla': 'Shimla', 'bombay': 'Mumbai', 'bengaluru': 'Bangalore', 'bangalore': 'Bangalore', 'madras': 'Chennai', 'calcutta': 'Kolkata', 'cochin': 'Kochi', 'trivandrum': 'Thiruvananthapuram', 'baroda': 'Vadodara', 'banaras': 'Varanasi', 'kashi': 'Varanasi', 'prayagraj': 'Prayagraj', 'allahabad': 'Prayagraj', 'ooty': 'Ooty', 'udagamandalam': 'Ooty' };

export function normalizeLocationName(input: string): string {
  const lower = input.toLowerCase().trim();
  if (STATE_ALIASES[lower]) return STATE_ALIASES[lower];
  if (CITY_ALIASES[lower]) return CITY_ALIASES[lower];
  for (const [alias, canonical] of Object.entries(STATE_ALIASES)) { if (lower.includes(alias)) return canonical; }
  for (const [alias, canonical] of Object.entries(CITY_ALIASES)) { if (lower === alias) return canonical; }
  return input.trim();
}

export function isStateName(input: string): boolean { const lower = input.toLowerCase().trim(); if (STATE_ALIASES[lower]) return true; return INDIAN_LOCATIONS.some((s) => s.state.toLowerCase() === lower); }
export function findState(stateName: string): IndianState | null { const normalized = normalizeLocationName(stateName); return INDIAN_LOCATIONS.find((s) => s.state === normalized) || null; }
export function getRepresentativeCities(stateName: string, maxCount: number = 5): CuratedLocation[] { const state = findState(stateName); if (!state) return []; return state.cities.slice(0, maxCount).map((city) => ({ city: city.name, state: state.state, country: 'India', latitude: city.latitude, longitude: city.longitude, timezone: city.timezone || 'Asia/Kolkata' })); }
