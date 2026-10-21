import path from "node:path";
import { fileURLToPath } from "node:url";

import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(dirname, "..");

/** En-têtes de sécurité de base, sur toutes les pages (site et back-office). */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  experimental: {
    // Page 404 en français pour toute adresse inconnue (le site a deux gabarits : site et back-office).
    globalNotFound: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    root: projectRoot,
  },
  images: {
    // Images servies par le back-office (collection « media »).
    localPatterns: [{ pathname: "/api/media/file/**" }, { pathname: "/**" }],
    // En production, images stockées sur Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
