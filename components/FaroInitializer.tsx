"use client";

import { useEffect } from "react";
import { getWebInstrumentations, initializeFaro } from "@grafana/faro-web-sdk";

export default function FaroInitializer() {
  useEffect(() => {
    // Only initialize Faro if the URL is configured
    if (process.env.NEXT_PUBLIC_GRAFANA_FARO_URL) {
      initializeFaro({
        url: process.env.NEXT_PUBLIC_GRAFANA_FARO_URL,
        app: {
          name: "portfolio-frontend",
          version: process.env.NEXT_PUBLIC_APP_VERSION,
          environment: process.env.NEXT_PUBLIC_APP_ENV,
        },
        instrumentations: [
          // Capture errors, web vitals, resource loading, etc.
          ...getWebInstrumentations(),
        ],
      });
    }
  }, []);

  return null;
}
