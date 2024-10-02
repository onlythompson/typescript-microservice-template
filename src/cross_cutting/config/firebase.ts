import * as admin from 'firebase-admin';

export function initializeFirebase(): admin.app.App {
    let app: admin.app.App;
  // Initialize Firebase
  app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

  return app;
}