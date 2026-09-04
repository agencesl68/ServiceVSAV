# Kits VSAV — CS Seppois-le-Bas

Application de gestion des kits d'intervention du Service VSAV.
PWA installable, hébergée sur GitHub Pages.

## Mise en ligne

Settings → Pages → Deploy from a branch → `main` / `/ (root)`.

Puis ouvrir l'URL publique sur les téléphones et faire
« Ajouter à l'écran d'accueil ».

## Configuration

La base de données (Supabase) se renseigne dans `index.html`, section 15,
tout en bas du script :

```js
const SUPABASE = {
  url:     'https://xxxxxxxx.supabase.co',
  anonKey: 'eyJhbGciOi...',
};
```

Tant que ces deux valeurs sont vides, l'application tourne en mode démo :
les saisies restent dans le navigateur et ne sont partagées avec personne.
Un bandeau orange l'indique en haut de l'écran.

## Après une modification d'image

Incrémenter `CACHE` dans `sw.js` (`vsav-kits-v1` → `v2`), sinon les
téléphones déjà installés gardent l'ancienne version.

---

CS Seppois-le-Bas · Service VSAV — développé par SL Agence
