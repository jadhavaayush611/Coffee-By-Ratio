# Coffee By Ratio ☕

A high-precision coffee brewing companion and calculator web application designed for coffee enthusiasts and engineers. Dial in your extraction, calculate brew yields, find the perfect water temperature, and use interactive step-by-step brew timers to achieve the perfect cup of coffee.

---

## 🚀 Features

- **Dynamic Ratio Calculator**
  - Instantly calculate and balance coffee grounds (grams), water volume (milliliters), or ratios (e.g., 1:15, 1:16.6) to fit your preferred brew strength.
- **Brew Yield Calculator**
  - Calculate the actual liquid beverage output by accounting for water retention in the coffee grounds.
- **Water Temperature Guide**
  - Determine the optimal extraction temperature based on your roast level (Light, Medium, or Dark) to avoid under-extraction or bitterness.
- **Interactive Step-by-Step Timers**
  - Guided brewing timers tailored to popular methods:
    - **Hario V60** (Pour-over)
    - **Chemex** (Pour-over)
    - **AeroPress**
    - **French Press**
    - **Cold Brew**
    - **Espresso**
- **Educational Blog & Guides**
  - Deep-dives into extraction mechanics, grind sizing, water temperature, and comparisons between different brew methods.

---

## 🛠️ Tech Stack

- **Framework:** [Astro](https://astro.build/) (Static Site Generation with Island Architecture)
- **UI Library:** [React 19](https://react.dev/) (For stateful interactive calculators and timers)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Hosting & Serverless:** [Cloudflare Pages](https://pages.cloudflare.com/) (Deployed via [Wrangler](https://developers.cloudflare.com/workers/wrangler/))

---

## 📂 Project Structure

The project is structured with a root configuration and a nested directory for the application code:

```text
/
├── code/                    # Main Astro application workspace
│   ├── public/              # Static assets (favicons, audio alerts, webmanifest)
│   ├── src/
│   │   ├── assets/          # SVG backgrounds & media
│   │   ├── components/      # UI components & interactive React calculators
│   │   ├── content/         # Markdown content for guides and blog posts
│   │   ├── data/            # Static data configurations (FAQs, guide metadata)
│   │   ├── layouts/         # Layout templates with SEO and Schema markup
│   │   ├── pages/           # Application routes (Astro pages & API endpoints)
│   │   └── styles/          # Global CSS containing Tailwind directives
│   ├── tsconfig.json        # TypeScript configuration
│   └── wrangler.jsonc       # Cloudflare Pages deployment configuration
└── README.md                # Project documentation (Root)
```

---

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (version `>= 22.12.0` is recommended).

### Installation & Run

All application code resides in the `code/` subdirectory. To install dependencies and run the local development server:

```bash
# Navigate to the code directory
cd code

# Install dependencies
npm install

# Start the local development server
npm run dev
```

The application will start locally, typically at `http://localhost:4321`.

### Commands Reference

From within the `code/` directory, the following scripts are available:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Astro development server at `localhost:4321`. |
| `npm run build` | Builds a production-ready static bundle in the `dist/` directory. |
| `npm run preview` | Runs a local preview of the production build. |
| `npm run deploy` | Builds the application and deploys it to Cloudflare Pages using Wrangler. |

---

## 🌐 Deployment

The application is deployed as a static site on **Cloudflare Pages**. 

To deploy manually, ensure you have set up your Cloudflare credentials and run:
```bash
cd code
npm run deploy
```
This triggers Astro to build the production output to `./dist/` and runs `wrangler pages deploy dist` to publish it to your Cloudflare account.
