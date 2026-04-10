# 🧠 Renoweb CMS – Case Studies System

A modern CMS for creating, managing, and publishing case studies with:

- 📦 **Firebase Realtime Database** → structured content storage
- 🖼️ **Supabase Storage** → image hosting & CDN delivery
- ⚡ **React (Next.js)** → dynamic UI & live preview

---

# 🏗️ Architecture Overview

```
User Input (CMS Form)
        ↓
Image Upload → Supabase Storage (Bucket)
        ↓
Get Public URL
        ↓
Combine with Form Data
        ↓
Save to Firebase Realtime DB
        ↓
Frontend fetches & renders case studies
```

---

# 📦 Why This Stack?

## 🔥 Firebase Realtime Database (Data Layer)

We use Firebase Realtime DB for:

- ⚡ **Ultra-fast reads/writes**
- 📄 Simple JSON structure
- 🔄 Real-time updates (future scalability)
- 💰 Free tier friendly

### Stored Data Example:

```json
{
  "case-studies": {
    "saas-growth-case": {
      "title": "How we scaled...",
      "category": "Lead Gen",
      "bannerUrl": "https://supabase-url...",
      "author": { "id": "gourab", "name": "Gourab Majumder" }
    }
  }
}
```

---

## 🖼️ Supabase Storage (Image Layer)

We use Supabase instead of Firebase Storage because:

- 🚫 No billing required initially
- 🌍 Global CDN delivery
- 🔗 Direct public URLs
- 🧩 Simpler integration

---

## ❓ Why NOT Firebase Storage?

Firebase Storage:

- Requires **Blaze plan (billing)**
- More complex rules setup
- Overkill for simple CMS

👉 Supabase is **lighter + faster to ship**

---

# 📁 Image Storage Structure

Bucket name:

```
contentimages
```

Folder structure:

```
contentimages/
  case-studies/
    saas-growth-case.webp
    ecommerce-case.jpg
```

---

## 🧠 Image Upload Flow

1. User selects image
2. File is uploaded to Supabase:

   ```js
   supabase.storage.from("contentimages").upload(...)
   ```

3. Public URL is generated:

   ```js
   getPublicUrl(fileName);
   ```

4. URL is saved in Firebase DB

---

## 🔗 Example Public URL

```
https://PROJECT_ID.supabase.co/storage/v1/object/public/contentimages/case-studies/slug.jpg
```

---

# 🧩 Component Architecture

## 📍 Main Page (`page.js`)

Handles:

- Global state
- Form submission
- Firebase + Supabase integration

---

## 🧾 Components Breakdown

### 1. `CaseStudyForm`

- Handles all inputs:
  - Title
  - Category
  - Challenges
  - Solutions

- Auto-generates slug

---

### 2. `BannerUploader`

- Drag & drop image upload
- Generates preview (base64)
- Stores `bannerFile` in state

---

### 3. `SidebarPreview`

- Live card preview
- Completion checklist
- Publish button trigger

---

### 4. `JsonModal`

- Shows final structured JSON
- Debugging & export tool

---

### 5. `AuthorSelector`

- Select primary + co-author
- Uses predefined author constants

---

### 6. `CMSNavbar`

- Navigation between sections
- Save status indicator

---

# 🔄 Data Flow (Step-by-Step)

```
[User fills form]
        ↓
[BannerUploader stores file]
        ↓
[handleSave triggered]
        ↓
[Validation runs]
        ↓
[Slug uniqueness check (Firebase)]
        ↓
[Upload image → Supabase]
        ↓
[Get public URL]
        ↓
[Build payload]
        ↓
[Save to Firebase]
        ↓
[Success state]
```

---

# 🔐 Security

## Firebase Rules

```json
{
  "rules": {
    "case-studies": {
      ".read": true,
      ".write": true
    }
  }
}
```

> ⚠️ Open for development. Restrict in production.

---

## Supabase Policies

### Upload:

```sql
bucket_id = 'contentimages'
```

### Read:

```sql
bucket_id = 'contentimages'
```

---

# ⚠️ Important Notes

### 1. Bucket Name Consistency

Must match everywhere:

```js
.from("contentimages")
```

---

### 2. Public Bucket Required

Supabase bucket must be:

```
Public = true
```

---

### 3. Slug Safety

Slug is used as:

```
Firebase key + image filename
```

Must NOT contain:

```
. # $ [ ]
```

---

# 🚀 Future Improvements

- ✏️ Edit existing case studies
- 🗑️ Delete case + image
- 🧠 Auto image compression
- 🔐 Auth-based CMS access
- 📊 Analytics dashboard

---

# 💯 Final Summary

| Layer | Tool             | Purpose            |
| ----- | ---------------- | ------------------ |
| UI    | React (Next.js)  | CMS interface      |
| Data  | Firebase RTDB    | Structured content |
| Media | Supabase Storage | Image hosting      |

---

# 🧠 Philosophy

> Use the **right tool for the right job**

- Firebase → fast structured data
- Supabase → simple, scalable media delivery

---

# 🏁 Status

✅ Fully functional CMS
✅ Production-ready (with minor security upgrades needed)
✅ No paid dependencies required

---

Made with ⚡ by Renoweb
