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
 * look for our custom 'session' cookie. It also checks JWT expiration to prevent infinite
 * redirect loops with layout.js.
 */
export function middleware(request) {
  const session = request.cookies.get('session')?.value;
  
  // Check if session is expired by decoding the JWT payload
  let isExpired = true;
  if (session) {
    try {
      const payloadBase64 = session.split('.')[1];
      if (payloadBase64) {
        // Convert base64url to base64
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const decodedJson = atob(base64);
        const decoded = JSON.parse(decodedJson);
        
        if (decoded.exp) {
          // exp is in seconds, Date.now() is in milliseconds
          isExpired = (decoded.exp * 1000) < Date.now();
        } else {
          isExpired = false;
        }
      }
    } catch (e) {
      console.error('Middleware: Error decoding session cookie', e);
      isExpired = true; // If we can't parse it, treat it as invalid/expired
    }
  }

  // PROTECTING CMS ROUTES
  if (request.nextUrl.pathname.startsWith('/cms')) {
    if (!session || isExpired) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Clean up expired cookie so the client doesn't keep sending it
      if (isExpired && session) {
        response.cookies.delete('session');
      }
      return response;
    }
  }

  // PREVENTING LOGIN PAGE LOOP
  if (request.nextUrl.pathname.startsWith('/login')) {
    if (session && !isExpired) {
      // User is authenticated and token is valid, push directly to dashboard
      return NextResponse.redirect(new URL('/cms/dashboard', request.url));
    }
    
    if (session && isExpired) {
      // Clean up expired cookie on the login page as well
      const response = NextResponse.next();
      response.cookies.delete('session');
      return response;
    }
  }

  // If no conditions match, allow the request to proceed
  return NextResponse.next();
}

/**
 * CONFIG: Matcher
 */
export const config = {
  matcher: ['/cms/:path*', '/login'],
};
