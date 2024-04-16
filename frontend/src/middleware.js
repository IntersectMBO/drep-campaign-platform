// Import createMiddleware from next-intl to configure internationalization middleware for Next.js.
import createMiddleware from "next-intl/middleware";
import { locales } from "./constants";
import { NextResponse } from "next/server";
 
// Export the middleware configuration to define supported locales and the default locale.
// This setup applies internationalization strategies across the application.
export default createMiddleware({
	locales: locales.variants, // Specify the supported locales for the application.
	defaultLocale: locales.defaultLocale, // Set the default locale to be used when no other locale matches.
});

// Define and export a config object to specify which paths the middleware should apply to.
// This ensures the internationalization logic only runs for specified routes.
export const config = {
	// matcher: ["/", "/(de|en)/:path*"], // Apply middleware to the root path and any path prefixed with supported locales.
	matcher: [
		// Skip all internal paths (_next)
		'/((?!_next).*)',
		// Optional: only run on root (/) URL
		// '/'
	  ],
};

// Get the preferred locale, similar to the above or using a library
function getLocale(request) {
	// const localeCookie = request?.cookies?.NEXT_LOCALE;
	// const locale = localeCookie ? localeCookie.value : null;
	// return locale;
	return locales.defaultLocale
  }
  
export function middleware(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.variants.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return
  if (pathname.match(/\.(svg|png|ico)$/)) return;


  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}
