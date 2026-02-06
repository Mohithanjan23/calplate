# Calplate - Nutrition Calculator

A modern, production-ready nutrition calculator built with React, Vite, and Tailwind CSS. Calplate calculates Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the industry-standard Mifflin-St Jeor equation.

![Calplate Interface](calplate-app/public/vite.svg)

## Features
- **Accurate Calculations**: Implements the Mifflin-St Jeor formula with activity multipliers.
- **Modern UI**: Clean, responsive interface built with Tailwind CSS.
- **Connection Health Check**: Includes Supabase integration status verification.
- **Production Ready**: Optimized Vite build with SPA routing configuration for Vercel.

## Quick Start

The main application source code is located in the `calplate-app` directory.

```bash
# Navigate to the app directory
cd calplate-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment on Vercel

1.  Import this repository into Vercel.
2.  Set the **Root Directory** to `calplate-app`.
3.  Add the following Environment Variables:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
4.  Deploy!

## Project Structure

- `calplate-app/`: The frontend application (Vite + React + TS).
- `backend/`: Legacy backend files (Python).
- `tests/`: Project tests.
