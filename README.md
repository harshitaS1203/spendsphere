# SpendSphere

Clean fintech bill-splitting app — **React + JSX + Bootstrap 5** (no TypeScript, no Tailwind, no Vite).
Built with Create React App.

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000

## Build for production

```bash
npm run build
```

## Stack

- React 18 (JavaScript / JSX only)
- React Router v6
- Bootstrap 5
- Create React App (react-scripts)

## Pages

1. `/` — Landing
2. `/login` — Sign in
3. `/dashboard` — Greeting, owe/owed cards, expense pie, group cards
4. `/groups` — All groups grid
5. `/groups/:id` — Members, expenses, who owes whom
6. `/groups/:id/summary` — Split summary
7. `/create-group` — New group with members & icon
8. `/profile` — User profile & stats
9. `/settings` — Currency & theme toggle

Indian users (Harshita, Dhruvi, Heer, Tvisha, Anuja, Riya, Aditi, Karan), ₹ everywhere.
Created groups persist in localStorage.
