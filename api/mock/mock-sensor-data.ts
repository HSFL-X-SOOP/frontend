import { SensorModule, LocationWithBoxes, Box, MeasurementTime, WaterBoxMeasurements, AirBoxMeasurements, WaterTemperatureOnlyMeasurements, BoxType } from '@/api/models/sensor.ts';

const randomInRange = (min: number, max: number, decimals: number = 2): number => {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
};

const generateTimeStamps = (count: number = 24): string[] => {
  const times: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    times.push(time.toISOString());
  }
  return times.reverse();
};


export const mockSensorModules: SensorModule[] = [
  {
    location: {
      id: 1,
      name: "Kieler Förde - Reventloubrücke",
      coordinates: { lat: 54.3477, lon: 10.1461 }
    },
    latestMeasurements: [
      {
        sensor: { id: 1, name: "Water Temp Sensor", description: "Temperature sensor in water", isMoving: false },
        measurementType: {
          id: 1,
          name: "Water Temperature",
          description: "Temperature of the water",
          unitName: "Celsius",
          unitSymbol: "°C",
          unitDefinition: "Temperature in degrees Celsius"
        },
        time: new Date(),
        value: randomInRange(8, 15)
      },
      {
        sensor: { id: 2, name: "Wave Height Sensor", description: "Measures wave height", isMoving: false },
        measurementType: {
          id: 2,
          name: "Wave Height",
          description: "Height of waves",
          unitName: "Meter",
          unitSymbol: "m",
          unitDefinition: "Height in meters"
        },
        time: new Date(),
        value: randomInRange(0.2, 1.5)
      }
    ]
  },
  {
    location: {
      id: 2,
      name: "Laboe",
      coordinates: { lat: 54.4108, lon: 10.2145 }
    },
    latestMeasurements: [
      {
        sensor: { id: 3, name: "Air Temp Sensor", description: "Temperature sensor in air", isMoving: false },
        measurementType: {
          id: 3,
          name: "Air Temperature",
          description: "Temperature of the air",
          unitName: "Celsius",
          unitSymbol: "°C",
          unitDefinition: "Temperature in degrees Celsius"
        },
        time: new Date(),
        value: randomInRange(10, 20)
      },
      {
        sensor: { id: 4, name: "Wind Speed Sensor", description: "Measures wind speed", isMoving: false },
        measurementType: {
          id: 4,
          name: "Wind Speed",
          description: "Speed of wind",
          unitName: "Meters per second",
          unitSymbol: "m/s",
          unitDefinition: "Speed in meters per second"
        },
        time: new Date(),
        value: randomInRange(2, 15)
      }
    ]
  },
  {
    location: {
      id: 3,
      name: "Strande",
      coordinates: { lat: 54.4389, lon: 10.1722 }
    },
    latestMeasurements: [
      {
        sensor: { id: 5, name: "Water Temp Sensor", description: "Temperature sensor in water", isMoving: false },
        measurementType: {
          id: 1,
          name: "Water Temperature",
          description: "Temperature of the water",
          unitName: "Celsius",
          unitSymbol: "°C",
          unitDefinition: "Temperature in degrees Celsius"
        },
        time: new Date(),
        value: randomInRange(8, 14)
      }
    ]
  }
];

const generateWaterBoxMeasurements = (): MeasurementTime<WaterBoxMeasurements>[] => {
  return generateTimeStamps().map(time => ({
    time,
    measurements: {
      waterTemperature: randomInRange(8, 15),
      waveHeight: randomInRange(0.1, 2.0),
      tide: randomInRange(-1.5, 1.5),
      standardDeviation: randomInRange(0.05, 0.3),
      batteryVoltage: randomInRange(12.0, 14.5)
    }
  }));
};

const generateAirBoxMeasurements = (): MeasurementTime<AirBoxMeasurements>[] => {
  return generateTimeStamps().map(time => ({
    time,
    measurements: {
      airTemperature: randomInRange(5, 25),
      windSpeed: randomInRange(0, 20),
      windDirection: randomInRange(0, 360, 0),
      gustSpeed: randomInRange(0, 25),
      gustDirection: randomInRange(0, 360, 0),
      humidity: randomInRange(40, 95, 0),
      airPressure: randomInRange(980, 1040, 0)
    }
  }));
};

const generateWaterTempOnlyMeasurements = (): MeasurementTime<WaterTemperatureOnlyMeasurements>[] => {
  return generateTimeStamps().map(time => ({
    time,
    measurements: {
      waterTemperature: randomInRange(8, 15)
    }
  }));
};

export const mockLocationWithBoxes: LocationWithBoxes[] = [
  {
    location: {
      id: 1,
      name: "Kieler Förde - Reventloubrücke",
      coordinates: { lat: 54.3477, lon: 10.1461 }
    },
    boxes: [
      {
        type: "WaterBox",
        id: 1,
        name: "WaterBox Station 1",
        description: "Complete water monitoring station",
        isMoving: false,
        measurementTimes: generateWaterBoxMeasurements()
      } as Box,
      {
        type: "AirBox",
        id: 2,
        name: "AirBox Station 1",
        description: "Weather monitoring station",
        isMoving: false,
        measurementTimes: generateAirBoxMeasurements()
      } as Box
    ]
  },
  {
    location: {
      id: 2,
      name: "Laboe",
      coordinates: { lat: 54.4108, lon: 10.2145 }
    },
    boxes: [
      {
        type: "WaterTemperatureOnlyBox",
        id: 3,
        name: "Simple Temp Station",
        description: "Basic water temperature monitoring",
        isMoving: false,
        measurementTimes: generateWaterTempOnlyMeasurements()
      } as Box,
      {
        type: "AirBox",
        id: 4,
        name: "AirBox Station 2",
        description: "Weather monitoring station",
        isMoving: false,
        measurementTimes: generateAirBoxMeasurements()
      } as Box
    ]
  },
  {
    location: {
      id: 3,
      name: "Strande",
      coordinates: { lat: 54.4389, lon: 10.1722 }
    },
    boxes: [
      {
        type: "WaterBox",
        id: 5,
        name: "WaterBox Station 2",
        description: "Complete water monitoring station",
        isMoving: false,
        measurementTimes: generateWaterBoxMeasurements()
      } as Box
    ]
  },
  {
    location: {
      id: 4,
      name: "Schilksee",
      coordinates: { lat: 54.4256, lon: 10.1761 }
    },
    boxes: [
      {
        type: "WaterTemperatureOnlyBox",
        id: 6,
        name: "Temp Monitor",
        description: "Water temperature sensor",
        isMoving: false,
        measurementTimes: generateWaterTempOnlyMeasurements()
      } as Box
    ]
  },
  {
    location: {
      id: 5,
      name: "Friedrichsort",
      coordinates: { lat: 54.3947, lon: 10.1900 }
    },
    boxes: [
      {
        type: "AirBox",
        id: 7,
        name: "Weather Station",
        description: "Complete weather monitoring",
        isMoving: false,
        measurementTimes: generateAirBoxMeasurements()
      } as Box,
      {
        type: "WaterBox",
        id: 8,
        name: "Marine Station",
        description: "Marine conditions monitoring",
        isMoving: false,
        measurementTimes: generateWaterBoxMeasurements()
      } as Box
    ]
  },
  {
    location: {
      id: 6,
      name: "Heikendorf",
      coordinates: { lat: 54.3789, lon: 10.2078 }
    },
    boxes: [
      {
        type: "WaterBox",
        id: 9,
        name: "Harbor Monitor",
        description: "Harbor water conditions",
        isMoving: false,
        measurementTimes: generateWaterBoxMeasurements()
      } as Box
    ]
  },
  {
    location: {
      id: 7,
      name: "Möltenort",
      coordinates: { lat: 54.3828, lon: 10.2039 }
    },
    boxes: [
      {
        type: "WaterTemperatureOnlyBox",
        id: 10,
        name: "Beach Temp",
        description: "Beach water temperature",
        isMoving: false,
        measurementTimes: generateWaterTempOnlyMeasurements()
      } as Box,
      {
        type: "AirBox",
        id: 11,
        name: "Beach Weather",
        description: "Beach weather conditions",
        isMoving: false,
        measurementTimes: generateAirBoxMeasurements()
      } as Box
    ]
  },
  {
    location: {
      id: 8,
      name: "Eckernförde",
      coordinates: { lat: 54.4635, lon: 9.8357 }
    },
    boxes: [
      {
        type: "AirBox",
        id: 12,
        name: "Harbor Air Station",
        description: "Harbor weather monitoring",
        isMoving: false,
        measurementTimes: generateAirBoxMeasurements()
      } as Box
    ]
  },
  {
    location: {
      id: 9,
      name: "Kappeln",
      coordinates: { lat: 54.6597, lon: 9.9356 }
    },
    boxes: [
      {
        type: "AirBox",
        id: 13,
        name: "City Weather",
        description: "Urban weather station",
        isMoving: false,
        measurementTimes: generateAirBoxMeasurements()
      } as Box
    ]
  },
  {
    location: {
      id: 10,
      name: "Rendsburg",
      coordinates: { lat: 54.3030, lon: 9.6636 }
    },
    boxes: [
      {
        type: "AirBox",
        id: 14,
        name: "Canal Weather",
        description: "Canal area weather monitoring",
        isMoving: false,
        measurementTimes: generateAirBoxMeasurements()
      } as Box
    ]
  },
  {
    location: {
      id: 11,
      name: "Flensburg",
      coordinates: { lat: 54.7836, lon: 9.4321 }
    },
    boxes: [
      {
        type: "AirBox",
        id: 15,
        name: "Port Weather",
        description: "Port area weather monitoring",
        isMoving: false,
        measurementTimes: generateAirBoxMeasurements()
      } as Box
    ]
  },
  {
    location: {
      id: 12,
      name: "Schleswig",
      coordinates: { lat: 54.5141, lon: 9.5554 }
    },
    boxes: [
      {
        type: "AirBox",
        id: 16,
        name: "City Air Monitor",
        description: "City air quality and weather",
        isMoving: false,
        measurementTimes: generateAirBoxMeasurements()
      } as Box
    ]
  }
];

export const mockTimeRangeData = (id: number, timeRange: string): LocationWithBoxes | null => {
  const location = mockLocationWithBoxes.find(loc => loc.location?.id === id);
  if (!location) {
    return null;
  }

  // Parse new timeRange format: '24h', '48h', '7d', '30d'
  let hours = 24; // default
  if (timeRange.endsWith('h')) {
    hours = parseInt(timeRange.slice(0, -1));
  } else if (timeRange.endsWith('d')) {
    hours = parseInt(timeRange.slice(0, -1)) * 24;
  }
  const dataPoints = Math.min(hours, 100);

  return {
    location: location.location,
    boxes: location.boxes.map(box => {
      if (box.type === BoxType.WaterTemperatureOnlyBox) {
        return {
          ...box,
          type: 'WaterTemperatureOnlyBox' as const,
          measurementTimes: box.measurementTimes.slice(0, dataPoints)
        } as Box;
      } else if (box.type === BoxType.WaterBox) {
        return {
          ...box,
          type: 'WaterBox' as const,
          measurementTimes: box.measurementTimes.slice(0, dataPoints)
        } as Box;
      } else {
        return {
          ...box,
          type: 'AirBox' as const,
          measurementTimes: box.measurementTimes.slice(0, dataPoints)
        } as Box;
      }
    })
  };
};