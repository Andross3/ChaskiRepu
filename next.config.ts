import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  // Las pantallas de demostración de la tienda se reemplazaron por las reales (con Supabase).
  async redirects() {
    return [
      { source: "/tienda/publicar", destination: "/registro-repuesto", permanent: false },
      { source: "/tienda/registro", destination: "/registro-proveedor", permanent: false },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
