# 🔨 MARLIN Frontend - Umfassender Refactoring Plan

**Version:** 1.0
**Erstellt:** Dezember 2024
**Ziel:** Transformation des MARLIN-Projekts in eine wartbare, performante Anwendung

---

## 📊 Executive Summary

Komprehensiver **9-Wochen Refactoring Plan** zur Umgestaltung der MARLIN React Native/Expo Anwendung:

| Status | Metrik | Aktuell | Ziel | Reduktion |
|--------|--------|---------|------|-----------|
| 🔴 | Codeduplizierung | 500+ Zeilen | <100 Zeilen | **80%** |
| 🔴 | `any` Types | 17 Dateien | 0 Dateien | **100%** |
| 🔴 | Testabdeckung | 0% | 80%+ | **80%+** |
| 🟠 | Performance | Baseline | -20-30% | **20-30%** |
| 🟠 | Bundle Size | Baseline | -10-15% | **10-15%** |

### 🎯 Hauptziele

✅ Code Duplication um 80% reduzieren (500+ → <100 Zeilen)
✅ Alle `any` Types eliminieren (17 Dateien → 0)
✅ 80%+ Testabdeckung für kritische Pfade
✅ Performance um 20-30% verbessern
✅ Klare, konsistente Architektur-Muster etablieren

---

## 📅 Phasen-Übersicht

| Phase | Fokus | Dauer | Aufwand | Priorität |
|-------|-------|-------|---------|-----------|
| **Phase 1** | Kritische Fixes | 2 Wo | 40h | 🔴 HÖCHST |
| **Phase 2** | Deduplication | 2 Wo | 50h | 🔴 HOCH |
| **Phase 3** | Performance | 1 Wo | 30h | 🟠 MITTEL |
| **Phase 4** | Architektur | 2 Wo | 45h | 🟠 MITTEL |
| **Phase 5** | Tests & Doku | 2 Wo | 50h | 🟡 MITTEL-HOCH |
| **TOTAL** | | **9 Wo** | **215h** | |

---

## 🔴 Phase 1: Kritische Fixes (Woche 1-2) - 40 Stunden

**HÖCHSTE PRIORITÄT** - Muss zuerst abgeschlossen werden, um Bugs zu verhindern.

### 1.1 Merge Duplicate Location Stores (8 Stunden)

**Problem:** Zwei überlappende Store-Dateien verursachen Verwirrung
- `api/stores/locations.ts` - Einfach: `getLocations()`, `getLocationById()`
- `api/stores/locationStore.ts` - Erweitert: `getHarborMasterLocation()`, `getLocationInfo()`

**Lösung:**
1. ✅ Neuen Store `api/stores/location.service.ts` mit allen Methoden erstellen
2. ✅ Alle Imports aktualisieren (6 Dateien betroffen)
3. ✅ Alte Dateien löschen
4. ✅ Integrationstests hinzufügen

**Betroffene Dateien:**
- `app/(dashboard)/marina/[name].tsx`
- `app/(profile)/profile.tsx`
- `hooks/useLocationInfo.ts`
- `hooks/useLocations.ts`

---

### 1.2 Fix Token Refresh Race Conditions (6 Stunden)

**Problem:** Mehrere gleichzeitige Token-Refresh-Aufrufe in `api/client.ts` (Zeilen 14-31)

**Aktuelle Probleme:**
```typescript
// Jede Anfrage prüft, ob Token erneuert werden muss
// Mehrere Anfragen triggern Refresh gleichzeitig
// Führt zu doppelten Refresh-Aufrufen und Auth-Fehlern
```

**Lösung: Mutex-Pattern implementieren**
```typescript
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const { data } = await axios.post<LoginResponse>(
        `${ENV.apiUrl}/auth/refresh`,
        { refreshToken }
      );
      const newSession = { /* ... */ };
      login(newSession);
      return newSession.accessToken;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
```

---

### 1.3 Move Misplaced Files (2 Stunden)

**Änderungen:**
- ✅ Verschiebe `components/useToast.tsx` → `hooks/useToast.ts`
- ✅ Update 15+ Imports in der App

---

### 1.4 Fix Missing useEffect Dependencies (8 Stunden)

**Audit erforderlich für:**
- `components/Map.native.tsx` (Zeilen 86-151)
- `components/Map.web.tsx` (Zeilen 63-167)
- `hooks/useSensors.ts` (Zeilen 38, 95)
- `hooks/useLocations.ts` (Zeile 49)
- `context/ThemeSwitch.tsx` (Zeilen 40-85)
- `app/(dashboard)/marina/[name].tsx` (Zeilen 80-150)

**Aktion:** ESLint `exhaustive-deps` Regel aktivieren, alle Violations beheben

---

### 1.5 Standardize Error Handling (8 Stunden)

**Problem:** 3 verschiedene Fehlerbehandlungs-Muster

**Lösung: `utils/errors.ts` erstellen**
```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: 'NETWORK' | 'AUTH' | 'VALIDATION' | 'UNKNOWN',
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown, context: string): AppError => {
  const logger = createLogger(context);

  if (isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    const code = mapStatusToCode(error.response?.status);
    logger.error('API Error', { status: error.response?.status, message });
    return new AppError(message, code, error.response?.status, error);
  }

  if (error instanceof Error) {
    logger.error('Error', error.message);
    return new AppError(error.message, 'UNKNOWN', undefined, error);
  }

  logger.error('Unknown error', JSON.stringify(error));
  return new AppError('Unknown error occurred', 'UNKNOWN', undefined, error);
};
```

---

### 1.6 Fix TypeScript 'any' Types (4 Stunden)

**Kritische Fixes:**
- ✅ `components/Map.native.tsx:44` - `mapRef: any` → korrekt typisiert
- ✅ `utils/measurements.tsx:70,78,93` - `data: any`, `t: any` → typisiert
- ✅ `api/stores/*` - `error: any` → `Error | AxiosError`
- ✅ `hooks/core/asyncHandler.ts:15` - `P extends any[]` → `P extends unknown[]`
- ✅ `components/speeddial/SpeedDial.tsx:91,130` - action und styles

**Neue Typen erstellen:**
```typescript
// types/api.ts
export type AxiosErrorType = AxiosError<{ message: string; code: string }>;

// types/measurements.ts
export type MeasurementData = Record<string, number | null>;

// types/translations.ts
import { TFunction } from 'i18next';
export type TranslationKey = string;
```

---

### 1.7 Add Accessibility Labels (4 Stunden)

**Add to all interactive elements:**
```typescript
<Button
  accessibilityLabel={t('map.controls.openMenu')}
  accessibilityHint={t('map.controls.openMenuHint')}
  accessibilityRole="button"
  {...props}
/>
```

**Zu aktualisieren:**
- Alle Map-Steuerelemente
- Navigationskomponenten
- Formulare
- Interaktive Cards

---

## 🟠 Phase 2: Code Quality & Deduplication (Woche 3-4) - 50 Stunden

**HOHE PRIORITÄT** - Reduziert drastisch die Wartungslast

### 2.1 Extract Shared Map Filter Logic (12 Stunden)

**Problem:** 95% Duplication zwischen Map.native.tsx und Map.web.tsx

**Lösung: `hooks/map/useMapFilters.ts` erstellen**
```typescript
export const useMapFilters = (props: MapProps, content: LocationWithBoxes[]) => {
  const [module1Visible, setModule1Visible] = useState(props.module1Visible ?? true);
  const [module2Visible, setModule2Visible] = useState(props.module2Visible ?? true);
  const [module3Visible, setModule3Visible] = useState(props.module3Visible ?? false);
  const [highlightedSensorId, setHighlightedSensorId] = useState<number | null>(null);

  const filteredContent = useMemo(() => {
    if (!content) return [];
    return content.filter(locationWithBoxes => {
      const hasWater = locationWithBoxes.boxes.some(
        box => box.type === BoxType.WaterBox ||
               box.type === BoxType.WaterTemperatureOnlyBox
      );
      const hasAir = locationWithBoxes.boxes.some(
        box => box.type === BoxType.AirBox
      );

      if (module1Visible && hasWater) return true;
      return module2Visible && hasAir;
    });
  }, [content, module1Visible, module2Visible]);

  return {
    module1Visible, setModule1Visible,
    module2Visible, setModule2Visible,
    module3Visible, setModule3Visible,
    highlightedSensorId, setHighlightedSensorId,
    filteredContent,
  };
};
```

**Auch erstellen:**
- `hooks/map/useMapSpeedDialActions.ts`
- `hooks/map/useMapCamera.ts`

**Impact:** 150+ Zeilen Duplication eliminiert

---

### 2.2 Extract Navigation Configuration (10 Stunden)

**Problem:** 200+ Zeilen zwischen navbar.tsx und tabbar.tsx dupliziert

**Lösung: `components/navigation/navigationConfig.ts`**
```typescript
export const NAVIGATION_ITEMS = [
  {
    key: 'map',
    label: 'navigation.map',
    icon: MapIcon,
    href: '/(map)/map' as const,
  },
  {
    key: 'dashboard',
    label: 'navigation.dashboard',
    icon: LayoutDashboard,
    href: '/(dashboard)/marina/Stadthafen Flensburg "Im Jaich"' as const,
  },
  // ...
] as const;
```

**Gemeinsame Komponenten extrahieren:**
- `NavigationMenu.tsx` - Menu Content
- `useNavigationAuth.ts` - Auth Logic
- `navigationStyles.tsx` - Shared Styling

---

### 2.3 Extract Speed Dial Actions Hook (6 Stunden)

**Erstelle: `hooks/map/useMapSpeedDialActions.ts`**

Array wird aktuell bei jedem Render neu erstellt (Map.native.tsx Zeilen 248-311, Map.web.tsx 247-318)

---

### 2.4 Reduce Prop Drilling (8 Stunden)

**Problem:** MapFilterButton benötigt 8 einzelne Props

**Aktuell:**
```typescript
<MapFilterButton
  module1Visible={module1Visible}
  setModule1Visible={setModule1Visible}
  module2Visible={module2Visible}
  setModule2Visible={setModule2Visible}
  module3Visible={module3Visible}
  setModule3Visible={setModule3Visible}
  isOpen={isFilterOpen}
  onOpenChange={setIsFilterOpen}
/>
```

**Besser:**
```typescript
interface MapFilterState {
  module1Visible: boolean;
  module2Visible: boolean;
  module3Visible: boolean;
}

<MapFilterButton
  filterState={filterState}
  onFilterChange={setFilterState}
  isOpen={isFilterOpen}
  onOpenChange={setIsFilterOpen}
/>
```

---

### 2.5 Consolidate Measurement Switch Statements (8 Stunden)

**Problem:** 200+ Zeilen duplizierte Switch-Statements in 4 Dateien

**Lösung: `config/measurements.ts` erstellen**
```typescript
export const MEASUREMENT_CONFIG: Record<MeasurementType, Config> = {
  [MeasurementType.WaterTemperature]: {
    displayName: 'Water Temperature',
    translationKey: 'measurements.waterTemperature',
    unit: '°C',
    color: '#F97316',
    bgColor: '$orange5',
    icon: 'Thermometer',
    precision: 1,
  },
  [MeasurementType.AirTemperature]: {
    displayName: 'Air Temperature',
    translationKey: 'measurements.airTemperature',
    unit: '°C',
    color: '#0EA5E9',
    bgColor: '$blue5',
    icon: 'Wind',
    precision: 1,
  },
  // ... alle Typen
} as const;
```

**Impact:** 150+ Zeilen eliminiert, einfach neue Messungen hinzufügen

---

### 2.6 Fix Utility Function Names (2 Stunden)

**Umbenennungen (PascalCase → camelCase):**
- ✅ `GetLatestMeasurements` → `getLatestMeasurements`
- ✅ `CreateMeasurementDictionary` → `createMeasurementDictionary`

---

### 2.7 Remove Remaining 'any' Types (4 Stunden)

✅ Alle verbleibenden `any` Types in der gesamten Codebase beheben

---

## 🟠 Phase 3: Performance Optimizations (Woche 5) - 30 Stunden

### 3.1 Memoize Map Components (8 Stunden)

**React.memo auf Marker-Komponenten anwenden:**
```typescript
export const SensorMarker = React.memo(
  ({ locationWithBoxes, isDark }: Props) => {
    return <Marker {...props} />;
  },
  (prevProps, nextProps) => {
    return (
      prevProps.locationWithBoxes.location.id === nextProps.locationWithBoxes.location.id &&
      prevProps.isDark === nextProps.isDark
    );
  }
);
```

---

### 3.2 Optimize SensorList Rendering (8 Stunden)

**Aktuelle Probleme:**
- 437 Zeilen - zu groß
- Teure Berechnungen im Render
- List Items nicht memoized
- Keine Virtualisierung

**Lösung:**
1. Sub-Komponenten extrahieren
2. Teure Berechnungen zu useMemo verschieben
3. React.memo auf SensorListItem
4. Virtualisierung für große Listen (100+)

---

### 3.3 Add API Caching with React Query (10 Stunden)

**Problem:** Kein Caching, gleiche Daten mehrfach abgerufen

**Lösung:**
```bash
npm install @tanstack/react-query
```

**Query Hooks erstellen:**
```typescript
export const useSensors = () => {
  return useQuery({
    queryKey: ['sensors'],
    queryFn: async () => {
      const store = useSensorStore();
      return store.getSensorDataNew();
    },
    staleTime: 5 * 60 * 1000,      // 5 Minuten
    cacheTime: 10 * 60 * 1000,     // 10 Minuten
  });
};
```

**Impact:** Automatisches Caching, Background-Refetch, Offline-Support

---

### 3.4 Lazy Load Heavy Components (4 Stunden)

**React.lazy für Route-Komponenten:**
```typescript
const DashboardContent = React.lazy(() => import('./DashboardContent'));

export default function Marina() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DashboardContent />
    </Suspense>
  );
}
```

---

## 🟠 Phase 4: Architecture & Structure (Woche 6-7) - 45 Stunden

### 4.1 Split Large Components (15 Stunden)

**marina/[name].tsx (578 → 5 Komponenten)**
```
DashboardHeader.tsx (50 Zeilen)
HarborInfoCard.tsx (80 Zeilen)
CurrentMeasurements.tsx (100 Zeilen)
HistoricalDataSection.tsx (120 Zeilen)
useDashboardData.ts (50 Zeilen)
→ Total: ~400 Zeilen (testbar, wartbar)
```

**SensorList.tsx (437 → 4 Komponenten)**
```
SensorListHeader.tsx (60 Zeilen)
SensorListFilters.tsx (80 Zeilen)
SensorListContent.tsx (150 Zeilen)
SensorListItem.tsx (70 Zeilen)
→ Total: ~360 Zeilen (memoizable)
```

---

### 4.2 Flatten Component Directory Structure (6 Stunden)

**Aktuell:**
```
components/map/markers/native/SensorMarker.tsx (4 Ebenen)
```

**Besser:**
```
components/map/NativeSensorMarker.tsx
components/map/WebSensorMarker.tsx
components/map/SensorMarker.tsx
→ Max Tiefe: 3 Ebenen
```

---

### 4.3 Implement Repository Pattern (12 Stunden)

**Trennung von API-Zugriff und State Management:**
```typescript
export class LocationRepository {
  constructor(private httpClient: AxiosInstance) {}

  async getAllLocations(): Promise<DetailedLocationDTO[]> {
    const { data } = await this.httpClient.get('/locations');
    return data;
  }
}

export const useLocationRepository = () => {
  const httpClient = useHttpClient();
  return useMemo(() => new LocationRepository(httpClient), [httpClient]);
};
```

**Repositories für:**
- LocationRepository
- SensorRepository
- AuthRepository
- UserRepository

---

### 4.4 Standardize Data Fetching (8 Stunden)

**Beide Patterns mit React Query ersetzen:**
- Alt: `asyncHandler.useAsync()`
- Alt: `useState + useEffect`
- Neu: `useQuery()` (unified)

---

### 4.5 Centralize Configuration (4 Stunden)

**`config/` Struktur:**
```
config/
├── constants.ts       # APP_CONSTANTS, MAP_CONSTANTS, STORAGE_KEYS
├── environment.ts     # API URLs (existiert bereits)
├── measurements.ts    # MEASUREMENT_CONFIG (Phase 2)
└── navigation.ts      # NAVIGATION_ITEMS (Phase 2)
```

---

## 🟡 Phase 5: Testing & Documentation (Woche 8-9) - 50 Stunden

### 5.1 Set Up Testing Infrastructure (8 Stunden)

```bash
npm install --save-dev jest @testing-library/react-native \
  @testing-library/react @testing-library/jest-dom ts-jest msw
```

**Erstelle:**
- `jest.config.js`
- `setupTests.ts`
- `.mswrc.js`

---

### 5.2 Write Unit Tests (12 Stunden)

**Priorität:**
1. `utils/errors.ts` - 100% Coverage
2. `utils/measurements.tsx` - 100% Coverage
3. `utils/time.tsx` - 100% Coverage
4. `utils/logger.ts` - 90% Coverage

---

### 5.3 Write Integration Tests (15 Stunden)

**Kritische Flows:**
- Authentication (3h)
- Map Interaction (4h)
- Dashboard (4h)
- Profile Management (4h)

---

### 5.4 Write Component Tests (10 Stunden)

**Kritische Komponenten:**
- Map
- Navigation
- Forms
- SensorList

---

### 5.5 Set Up API Mocking (5 Stunden)

**MSW (Mock Service Worker) Setup**

---

### 5.6 Add Documentation (10 Stunden)

**Erstelle:**
1. `docs/ARCHITECTURE.md`
2. `docs/COMPONENTS.md`
3. `docs/API.md`
4. `docs/TESTING.md`
5. `CONTRIBUTING.md`

---

## 📈 Success Metrics

| Kategorie | Aktuell | Ziel | Status |
|-----------|---------|------|--------|
| **Code Quality** |
| Duplication | 500+ | <100 | 80% ↓ |
| `any` Types | 17 | 0 | 100% ↓ |
| Test Coverage | 0% | 80%+ | 80%+ ↑ |
| **Performance** |
| Bundle Size | Baseline | -10-15% | 15% ↓ |
| Map Render | Baseline | -20-30% | 30% ↑ |
| API Calls | Multiple | -50% | 50% ↓ |
| First Load | Baseline | -15-20% | 20% ↑ |
| **Developer Experience** |
| Feature Dev | 1x | 0.7x | 30% ↑ |
| Bug Fixes | 1x | 0.75x | 25% ↑ |
| Onboarding | 1x | 0.5x | 50% ↑ |

---

## 🛡️ Risk Mitigation

| Risiko | Mitigation |
|--------|-----------|
| Auth-Fehler durch Token-Änderungen | Mit Staging-API testen |
| State-Logik bei Component-Split verloren | Integrationstests schreiben |
| Memoization verhindert notwendige Updates | React DevTools Profiling |
| Type-Änderungen brechen Imports | LSP für Instant-Feedback |

---

## ✅ Checkliste Phase 1

```
WOCHE 1:
- [ ] Task 1.1: Duplicate Stores mergen
- [ ] Task 1.2: Token Refresh Race Condition fixen
- [ ] Task 1.3: useToast.tsx verschieben

WOCHE 2:
- [ ] Task 1.4: useEffect Dependencies fixen
- [ ] Task 1.5: Error Handling standardisieren
- [ ] Task 1.6: TypeScript `any` Types fixen
- [ ] Task 1.7: Accessibility Labels hinzufügen
- [ ] Review & Testing
```

---

## 📞 Support

**Bei Fragen oder Problemen:**
1. Beziehe dich auf den entsprechenden Task in diesem Plan
2. Konsultiere die Codebase-Analyse
3. Folge den vorgegebenen Codesnippets

---

**Viel Erfolg bei der Refaktorierung! 🚀**