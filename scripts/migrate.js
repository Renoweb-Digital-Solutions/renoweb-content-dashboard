require('dotenv').config();
const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
});
const db = admin.database();

// Initialize Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function migrate() {
    try {
        console.log("Fetching entire database...");
        const snapshot = await db.ref('/').once('value');
        const data = snapshot.val();
        
        let jsonString = JSON.stringify(data);
        
        // Find all Supabase URLs
        const supabaseUrlPrefix = "https://ifolrlareviovjvbavok.supabase.co/storage/v1/object/public/contentimages/";
        const urlRegex = /https:\/\/ifolrlareviovjvbavok\.supabase\.co\/storage\/v1\/object\/public\/contentimages\/([a-zA-Z0-9\-\._\/]+)/g;
        
        const matches = [...jsonString.matchAll(urlRegex)];
        const uniqueUrls = [...new Set(matches.map(m => m[0]))];
        
        console.log(`Found ${uniqueUrls.length} unique Supabase image URLs in the database.`);
        
        const urlMap = {};
        
        for (let i = 0; i < uniqueUrls.length; i++) {
            const oldUrl = uniqueUrls[i];
            console.log(`[${i+1}/${uniqueUrls.length}] Migrating: ${oldUrl}`);
            
            try {
                // Upload to Cloudinary directly from the Supabase public URL
                const result = await cloudinary.uploader.upload(oldUrl, {
                    folder: "renoweb_migrated",
                    use_filename: true,
                    unique_filename: true,
                    overwrite: true,
                });
                
                console.log(`  -> Uploaded to Cloudinary: ${result.secure_url}`);
                urlMap[oldUrl] = result.secure_url;
            } catch (err) {
                console.error(`  -> Failed to migrate ${oldUrl}:`, err.message || err);
            }
        }
        
        console.log("Replacing URLs in database JSON...");
        let newJsonString = jsonString;
        for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
            // Global replace
            newJsonString = newJsonString.split(oldUrl).join(newUrl);
        }
        
        console.log("Saving updated database...");
        const newData = JSON.parse(newJsonString);
        await db.ref('/').set(newData);
        
        console.log("Migration complete!");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
