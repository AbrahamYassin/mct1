# MyCVTop — Next.js (Vercel Ready)

- **Framework**: Next.js 14 (App Router) + Tailwind CSS
- **DB**: MongoDB (Mongoose)
- **Auth**: JWT en **cookie HTTP-only** (API routes)
- **Upload Avatar**: Cloudinary (optionnel)
- **Fonctionnalités**: Auth, CRUD CV, éditeur avec templates (Modern / Clean / Basic), export HTML imprimable

## Démarrage local
```bash
cp .env.example .env.local
npm install
npm run dev
```
Ouvre http://localhost:3000

## Variables d'environnement
```
MONGODB_URI=mongodb://localhost:27017/mycvtop_next
JWT_SECRET=votre_secret_long
# Cloudinary (optionnel; sinon l'upload renvoie 501)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
USE_CLOUDINARY=false
```
Sur Vercel, ajoute ces variables dans le projet.

## Déploiement Vercel
- Pas de configuration spéciale : Next.js + App Router est supporté nativement.
- Si Cloudinary activé (`USE_CLOUDINARY=true`), l'upload fonctionne en serverless.

## Notes
- L’API est intégrée à Next.js via `/app/api/*`.
- Les cookies d’auth sont `httpOnly; secure; sameSite=Lax` (prod).
