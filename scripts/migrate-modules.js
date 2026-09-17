require('dotenv').config();
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
});
const db = admin.database();

const MODULES_TO_MIGRATE = [
    "blogs",
    "case-studies",
    "research-hub",
    "authors",
    "projects",
    "press"
];

async function migrateModules() {
    try {
        console.log("Fetching entire database...");
        const snapshot = await db.ref('/').once('value');
        const data = snapshot.val() || {};
        
        const updates = {};
        let hasMigrations = false;
        
        for (const mod of MODULES_TO_MIGRATE) {
            if (data[mod]) {
                console.log(`Migrating /${mod} to /renoweb/${mod}...`);
                updates[`renoweb/${mod}`] = data[mod];
                updates[mod] = null; // Delete old path
                hasMigrations = true;
            } else {
                console.log(`No data found for /${mod}, skipping.`);
            }
        }
        
        if (hasMigrations) {
            console.log("Applying updates to Firebase...");
            await db.ref('/').update(updates);
            console.log("Migration complete!");
        } else {
            console.log("Nothing to migrate.");
        }
        
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrateModules();
