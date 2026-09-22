/**
 * geotagService.ts
 *
 * Pure service functions for GPS capture, OSM Nominatim reverse geocoding,
 * address deduplication, and photo stamping.
 *
 * Designed specifically for the SIH Citizen Photo Capture feature.
 * Uses OpenStreetMap Nominatim — no paid API key required.
 */

// ============================================================
// TYPES
// ============================================================

export interface GPSData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface NominatimAddress {
  village?: string;
  town?: string;
  city?: string;
  municipality?: string;
  suburb?: string;
  neighbourhood?: string;
  county?: string;
  state_district?: string;
  district?: string;
  state?: string;
  country?: string;
  country_code?: string;
}

export interface NominatimResponse {
  place_id?: number;
  display_name?: string;
  address?: NominatimAddress;
}

export interface ParsedAddress {
  locality: string | null;    // village / town / city / municipality
  district: string | null;    // district / county
  state: string | null;       // state
  country: string | null;     // country
  formatted: string;          // final deduped display string
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  capturedAt: number;
  formattedAddress: string;
  parsedAddress: ParsedAddress;
  source: 'nominatim-osm';
}

/**
 * Validates that GPS coordinates are within legal Earth boundaries:
 * Latitude: -90 to 90
 * Longitude: -180 to 180
 */
export function isValidCoordinate(latitude: number, longitude: number): boolean {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(latitude === 0 && longitude === 0)
  );
}

/**
 * Takes location object or individual component strings (village, block, district, state, country)
 * and returns a clean, deduplicated location string.
 * Prevents output like "Tiruppur, Tiruppur, Tiruppur, Tamil Nadu".
 */
export function formatCanonicalAddress(location: {
  village?: string;
  block?: string;
  district?: string;
  state?: string;
  country?: string;
  formattedAddress?: string;
}): string {
  const parts: string[] = [];
  const seenNorms = new Set<string>();

  const addPart = (val?: string) => {
    if (!val || !val.trim()) return;
    const trimmed = val.trim();
    const norm = trimmed
      .toLowerCase()
      .replace(/\s+district\s*$/i, '')
      .replace(/\s+block\s*$/i, '')
      .replace(/\s+county\s*$/i, '')
      .replace(/\s+taluk\s*$/i, '')
      .replace(/\s+subdivision\s*$/i, '')
      .trim();

    if (norm.length > 0 && !seenNorms.has(norm)) {
      seenNorms.add(norm);
      parts.push(trimmed);
    }
  };

  addPart(location.village);
  addPart(location.block);
  addPart(location.district);
  addPart(location.state);
  addPart(location.country);

  if (parts.length > 0) {
    return parts.join(', ');
  }

  if (location.formattedAddress) {
    const rawTokens = location.formattedAddress.split(',').map((s) => s.trim());
    const dedupedTokens: string[] = [];
    const seenTokenNorms = new Set<string>();

    for (const token of rawTokens) {
      if (!token) continue;
      const norm = token
        .toLowerCase()
        .replace(/\s+district\s*$/i, '')
        .trim();
      if (!seenTokenNorms.has(norm)) {
        seenTokenNorms.add(norm);
        dedupedTokens.push(token);
      }
    }
    return dedupedTokens.join(', ');
  }

  return 'Location Specified';
}

// ============================================================
// GPS CAPTURE
// ============================================================

/**
 * Obtains the device's current GPS position.
 * Uses high accuracy mode. Never returns a cached or stale position.
 * Throws a user-friendly error string on failure.
 */
export function getCurrentGPS(): Promise<GPSData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        let finalLat = position.coords.latitude;
        let finalLng = position.coords.longitude;
        let finalAcc = position.coords.accuracy;

        if (!isValidCoordinate(finalLat, finalLng)) {
          reject('Invalid GPS coordinates received from device.');
          return;
        }

        resolve({
          latitude: finalLat,
          longitude: finalLng,
          accuracy: finalAcc,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject('Location permission is required to geotag this photo.');
            break;
          case error.POSITION_UNAVAILABLE:
            reject(
              'Unable to determine your current location. Please enable location and try again.'
            );
            break;
          case error.TIMEOUT:
            reject(
              'Unable to determine your current location. Please try again.'
            );
            break;
          default:
            reject(
              'Unable to determine your current location. Please try again.'
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0, // never reuse a cached position
      }
    );
  });
}

// ============================================================
// REVERSE GEOCODING (OSM NOMINATIM)
// ============================================================

/**
 * Calls OSM Nominatim to convert GPS coordinates to a human-readable address.
 * Never fabricates an address. Returns null if the call fails.
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<NominatimResponse | null> {
  if (!isValidCoordinate(latitude, longitude)) {
    console.warn('[geotagService] Invalid coordinates provided to reverseGeocode:', latitude, longitude);
    return null;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SIH2026-CitizenApp/1.0 (contact@sih2026.gov.in)',
        'Accept-Language': 'en',
      },
    });

    if (!response.ok) {
      console.warn('[geotagService] Nominatim responded with status', response.status);
      return null;
    }

    const data: NominatimResponse = await response.json();
    return data;
  } catch (err) {
    console.warn('[geotagService] Nominatim reverse geocoding failed:', err);
    return null;
  }
}

// ============================================================
// ADDRESS PARSING & DEDUPLICATION
// ============================================================

/**
 * Normalizes a raw string for case-insensitive deduplication.
 * Trims, lowercases, and removes common suffixes like "district".
 */
function normalizeForDedup(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+district\s*$/i, '')
    .replace(/\s+county\s*$/i, '')
    .replace(/\s+/g, ' ');
}

/**
 * Parses the Nominatim response into a structured, deduplicated address.
 * Never invents or fills in missing values.
 */
export function parseNominatimAddress(response: NominatimResponse): ParsedAddress {
  const addr = response.address || {};

  const rawLocality =
    addr.village ||
    addr.town ||
    addr.city ||
    addr.municipality ||
    addr.suburb ||
    addr.neighbourhood ||
    null;

  const rawDistrict =
    addr.district ||
    addr.county ||
    addr.state_district ||
    null;

  const rawState = addr.state || null;
  const rawCountry = addr.country || null;

  const formattedDistrict = rawDistrict
    ? /district$/i.test(rawDistrict.trim())
      ? rawDistrict.trim()
      : `${rawDistrict.trim()} District`
    : null;

  const formatted = formatCanonicalAddress({
    village: rawLocality || undefined,
    district: formattedDistrict || undefined,
    state: rawState || undefined,
    country: rawCountry || undefined,
  });

  return {
    locality: rawLocality,
    district: formattedDistrict,
    state: rawState,
    country: rawCountry,
    formatted,
  };
}

// ============================================================
// FULL GEOCODE PIPELINE
// ============================================================

/**
 * High-level function: takes GPS coordinates, reverse geocodes them,
 * parses and deduplicates the address.
 * Returns a full LocationData object or null on failure.
 */
export async function buildLocationData(gps: GPSData): Promise<LocationData | null> {
  const nominatimResponse = await reverseGeocode(gps.latitude, gps.longitude);
  if (!nominatimResponse) return null;

  const parsedAddress = parseNominatimAddress(nominatimResponse);
  if (!parsedAddress.formatted) return null;

  return {
    latitude: gps.latitude,
    longitude: gps.longitude,
    accuracy: gps.accuracy,
    capturedAt: gps.timestamp,
    formattedAddress: parsedAddress.formatted,
    parsedAddress,
    source: 'nominatim-osm',
  };
}

// ============================================================
// PHOTO STAMPING
// ============================================================

/**
 * Draws a single semi-transparent location footer at the bottom of the image.
 *
 * IMPORTANT SAFETY GUARANTEES:
 * - Always creates a fresh canvas.
 * - Always uses the originalDataUrl (never a previously stamped image).
 * - The footer is drawn ONCE and only once.
 * - Returns a new dataUrl with the stamp baked in.
 *
 * @param originalDataUrl  The raw camera capture (not previously stamped).
 * @param formattedAddress The verified, deduplicated address string.
 */
export function stampPhotoWithAddress(
  originalDataUrl: string,
  formattedAddress: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas 2D context'));
        return;
      }

      // 1. Draw the original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 2. Measure text and determine footer height
      const padding = 14;
      const pinSize = 16;
      const fontSize = Math.max(14, Math.min(18, Math.floor(canvas.width / 40)));
      const lineHeight = fontSize + 6;

      ctx.font = `bold ${fontSize}px sans-serif`;

      // Wrap address into lines (max width = canvas.width - padding*2 - pinSize)
      const maxLineWidth = canvas.width - padding * 2 - pinSize - 8;
      const words = formattedAddress.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxLineWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const footerHeight = padding * 2 + lines.length * lineHeight;

      // 3. Draw semi-transparent dark footer background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
      ctx.fillRect(0, canvas.height - footerHeight, canvas.width, footerHeight);

      // 4. Draw a thin accent line at the top of the footer
      ctx.fillStyle = '#f59e0b'; // amber-400
      ctx.fillRect(0, canvas.height - footerHeight, canvas.width, 2);

      // 5. Draw pin icon (using text emoji for simplicity — no external dependency)
      ctx.font = `${pinSize}px sans-serif`;
      ctx.fillStyle = '#34d399'; // emerald-400
      const pinX = padding;
      const firstLineY = canvas.height - footerHeight + padding + fontSize;
      ctx.fillText('📍', pinX, firstLineY);

      // 6. Draw address lines
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = '#ffffff';

      const textX = padding + pinSize + 8;
      lines.forEach((line, idx) => {
        const y = canvas.height - footerHeight + padding + (idx + 1) * lineHeight;
        ctx.fillText(line, textX, y);
      });

      // 7. Export stamped image
      const stampedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      resolve(stampedDataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load original image for stamping'));
    };

    img.src = originalDataUrl;
  });
}

// ============================================================
// GPS ACCURACY VALIDATION
// ============================================================

/** Maximum acceptable GPS accuracy in metres for reliable geotagging. */
const MAX_ACCEPTABLE_ACCURACY_METERS = 2000;

/**
 * Returns true if the GPS accuracy is acceptable for geotagging.
 */
export function isGPSAcceptable(accuracy: number): boolean {
  return accuracy <= MAX_ACCEPTABLE_ACCURACY_METERS;
}

/**
 * Returns a user-friendly accuracy label.
 */
export function getAccuracyLabel(accuracy: number): string {
  if (accuracy <= 10) return 'Excellent';
  if (accuracy <= 50) return 'Good';
  if (accuracy <= 150) return 'Fair';
  if (accuracy <= 500) return 'Poor';
  return 'Very Poor';
}

/**
 * Calculates the great-circle distance between two GPS coordinates using the Haversine formula.
 * Returns the distance in meters.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (value: number) => (value * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
