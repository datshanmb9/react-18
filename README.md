# Tasty Bites: React Router (Lab Session 18)

The Session 17 food menu, now with real pages: Home, Menu, one page per dish, Contact and a
"not found" page. Uses React Router (`react-router`), Bootstrap 5, React 19 and Vite 8.

Needs Node 22.22 or newer (React Router 8). On older Node run `npm install react-router@7`
once; the code is identical.

```bash
npm install
npm run dev      # open http://localhost:5173
npm run build    # production build
npx vitest run   # automated tests
```

Pages: `/`, `/menu`, `/menu/3` (any dish id from 1 to 8), `/contact`, anything else = 404.
