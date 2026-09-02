"use client";

import { useEffect, useState } from "react";
import { fetchCurrentTemperature } from "@/services/api/weather";

const REFRESH_MS = 10 * 60 * 1000;

type WeatherStatus = "loading" | "ready" | "unsupported" | "error";

type WeatherState = {
  status: WeatherStatus;
  temperatureC: number | null;
};

function isGeolocationSupported() {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
}

export function useWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>(() =>
    isGeolocationSupported()
      ? { status: "loading", temperatureC: null }
      : { status: "unsupported", temperatureC: null },
  );

  useEffect(() => {
    if (!isGeolocationSupported()) return;

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const load = (lat: number, lon: number) => {
      fetchCurrentTemperature(lat, lon)
        .then((weather) => {
          if (!cancelled) setState({ status: "ready", temperatureC: weather.temperatureC });
        })
        .catch(() => {
          if (!cancelled) setState({ status: "error", temperatureC: null });
        });
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        load(latitude, longitude);
        intervalId = setInterval(() => load(latitude, longitude), REFRESH_MS);
      },
      () => {
        if (!cancelled) setState({ status: "error", temperatureC: null });
      },
      { timeout: 8000 },
    );

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return state;
}
