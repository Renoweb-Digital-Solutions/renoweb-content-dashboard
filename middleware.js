import { NextResponse } from 'next/server';

/**
 * Next.js Edge Middleware for Route Protection
 * 
 * WHY: We use Edge middleware to intercept requests BEFORE they hit the Node.js server.
 * This is crucial for performance and security. If an unauthenticated user tries to hit
 * a protected route, we block them at the CDN level, saving server bandwidth and preventing
 * potential server-side rendering exploits.
 * 
 * HOW: It runs on Vercel's Edge network. It parses the incoming HTTP request headers to 
 * look for our custom 'session' cookie (which is set by the login API).
 */
export function middleware(request) {
  // Extract the 'session' cookie. This is an httpOnly cookie, meaning client-side JS can't see it.
  const session = request.cookies.get('session');
  
  // PROTECTING CMS ROUTES
  // If the user is trying to access ANY path starting with /cms...
  if (request.nextUrl.pathname.startsWith('/cms')) {
    if (!session) {
      // Security Action: No session cookie found.
      // We immediately redirect them to the /login page.
      // request.url is passed so the redirect resolves to the absolute URL.
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // PREVENTING LOGIN PAGE LOOP
  // If the user is already authenticated and tries to visit the login page...
  if (request.nextUrl.pathname.startsWith('/login')) {
    if (session) {
      // UX Action: Redirect them straight to the dashboard to save them a click.
      return NextResponse.redirect(new URL('/cms/dashboard', request.url));
    }
  }

  // If no conditions match, allow the request to proceed to the Next.js router.
  return NextResponse.next();
}

/**
 * CONFIG: Matcher
 * 
 * WHY: Running middleware on every single image, CSS file, or public page is a waste of resources.
 * HOW: The `matcher` tells Next.js exactly which route patterns this middleware should execute on.
 * Here, we strictly run it for any path under /cms/ and exactly on /login.
 */
export const config = {
  matcher: ['/cms/:path*', '/login'],
};
