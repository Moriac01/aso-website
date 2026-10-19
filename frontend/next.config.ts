import path from "node:path";
import { fileURLToPath } from "node:url";

import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(dirname, "..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  images: {
    // Images servies par le back-office (collection « media »).
    localPatterns: [{ pathname: "/api/media/file/**" }, { pathname: "/**" }],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
