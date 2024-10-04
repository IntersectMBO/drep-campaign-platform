import { locales } from '@/constants';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { AppContextProvider } from '@/context/context';
import { NextIntlClientProvider } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Poppins } from 'next/font/google';
import { notFound } from 'next/navigation';
import '@/assets/styles/globals.css';
import dynamic from 'next/dynamic';
import '@fontsource/poppins';
import { ThemeProvider } from '@mui/material';
import theme from '@/assets/theme';
import PageBanner from '@/components/atoms/PageBanner';
const poppins = Poppins({
  weight: '400',
  style: 'normal',
  subsets: ['devanagari'],
});

export function generateStaticParams() {
  // Generate static params for each locale, used in static generation methods.
  return locales.variants.map((locale) => ({ locale }));
}

// Define common metadata for the application.
export const metadata = {
  title: 'Voltaire DRep Campaign Module',
  description:
    'Town Halls and Campaigns for Voltaire DReps and their communities.',
};
// Dynamically imported ClientScriptLoader with no SSR
const SprigClientScriptLoader = dynamic(
  () => import('@/components/analytics/SprigClientScriptLoader'),
  { ssr: false },
);
const FathomClientScriptLoader = dynamic(
  () => import('@/components/analytics/AnalyticsLoader'),
  { ssr: false },
);

async function RootLayout({ children, params: { locale } }) {
  // Root layout component, sets up locale, loads messages, and wraps the app with providers.
  unstable_setRequestLocale(locale); // Set the locale for the request, use with caution due to unstable API.
  if (!locales.variants.includes(locale)) notFound(); // Check if the locale is supported, otherwise trigger a 404.

  let messages;
  try {
    // Attempt to dynamically load the message bundle for the current locale.
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound(); // Trigger a 404 if the message bundle cannot be loaded.
  }

  return (
    // Set the document language
    <html lang={locale}>
      <head>
        <title>{metadata.title}</title>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      {/* Apply font class and suppress hydration warning. */}
      <body className={poppins.className} suppressHydrationWarning={true}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <AppContextProvider>
                <PageBanner />
                {children}
                </AppContextProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
          <SprigClientScriptLoader />
          <FathomClientScriptLoader />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
