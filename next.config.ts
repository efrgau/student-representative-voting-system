import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// En `next dev` expone los bindings de Cloudflare (D1 local) vía
// getCloudflareContext({ async: true }). Sin efecto en producción.
if (process.env.NODE_ENV === "development") {
  void initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {};

export default nextConfig;
