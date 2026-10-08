import { Auth, WorkersKVStoreSingle } from 'firebase-auth-cloudflare-workers';

// … cut: role and permission tables

/**
 * Auth middleware - verifies Firebase ID token and checks user role
 */
export async function requireAuth(c, next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized', message: 'Missing or invalid authorization header' }, 401);
  }

  const token = authHeader.substring(7);

  // Initialize KV store wrapper first (like in src/auth.js)
  const kvStore = WorkersKVStoreSingle.getOrInitialize(
    c.env.FIREBASE_PROJECT_ID,
    c.env.JWK_CACHE
  );

  const auth = Auth.getOrInitialize(c.env.FIREBASE_PROJECT_ID, kvStore);

  try {
    const decodedToken = await auth.verifyIdToken(token, false);

    if (!decodedToken || !decodedToken.uid) {
      return c.json({ error: 'Unauthorized', message: 'Invalid token' }, 401);
    }

    // Attach user info to context
    c.set('uid', decodedToken.uid);
    c.set('email', decodedToken.email);

    await next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return c.json({ error: 'Unauthorized', message: 'Token verification failed' }, 401);
  }
}

// … cut: requireRole, Firestore lookup helpers
