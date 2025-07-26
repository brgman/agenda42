const withImages = require("next-images");
const withInterceptStdout = require("next-intercept-stdout");

var hideWarn = [
  "Invalid next.config.js options detected:",
  "The value at .experimental has an unexpected property, images, which is not in the list of allowed properties",
  "https://nextjs.org/docs/messages/invalid-next-config",
  "You have enabled experimental feature (images) in next.config.js.",
  "Experimental features are not covered by semver, and may cause unexpected or broken application behavior. Use at your own risk.",
  "Fast Refresh had to perform a full reload.",
  "Cannot read properties of null (reading 'length')",
];

const nextConfig = withInterceptStdout(
  withImages({
    images: { disableStaticImages: true },
    reactStrictMode: true,
    swcMinify: true,
    webpack(config, options) {
      return config;
    },
    async rewrites() {
      return [
        {
          source: "/api/auth/callback",
          destination: "/api/auth/callback",
        },
        {
          source: "/api/all_events",
          destination: "/api/all_events",
        },
        {
          source: "/api/get_user",
          destination: "/api/get_user",
        },
        {
          source: "/api/make_stot",
          destination: "/api/make_slot",
        },
        {
          source: "/api/get_user",
          destination: "/api/get_user",
        },
        {
          source: "/api/proxy",
          destination: "/api/proxy",
        },
        {
          source: "/api/refresh_agenda",
          destination: "/api/refresh_agenda",
        },
        {
          source: "/api/friends_data",
          destination: "/api/friends_data",
        }
      ];
    },
    env: {
      API_URI: process.env.API_URI,
      CLIENT_ID: process.env.CLIENT_ID,
      API_TOKEN: process.env.API_TOKEN,
      PORT: process.env.PORT,
      STATUS: process.env.STATUS,
      POINTS_FOR_PINNED: process.env.POINTS_FOR_PINNED,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  }),
  (log) => (hideWarn.some((warn) => log.includes(warn)) ? "" : log),
);

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "aron-bergman",
  project: "agenda42",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
