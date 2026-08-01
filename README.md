# 📚 Tricity Bookstall (Prabodhanam) - Full-Stack Web Application

A modern, vibrant, and feature-rich full-stack web application for **Tricity Bookstall (Prabodhanam)**. Built with **React.js** for the frontend and **NestJS** for the backend REST API, this platform helps bring curated wisdom literature, kids value education, and philosophical dialogue to schools, colleges, and communities across **Chandigarh, Mohali, and Panchkula**.

---

## 🌟 Key Features

* **🎈 Bal Prabodhanam (Kids Wisdom Corner):** Dedicated section with illustrated moral storybooks, Bal Gita, value education guides, and an interactive **Daily Wisdom Card Generator**.
* **📚 Interactive Book Catalog & Search:** Live keyword search, category filters (*Kids Wisdom, Mind & Character, Self Discovery, Vedanta & Classics*), and language selection (English/Hindi/Bilingual).
* **📸 Campus Events Showcase:** Filterable gallery displaying photos from past campus stalls (*Panjab University Sector 14, CGC University Mohali, Doon Public School Panchkula, Indradhanush Auditorium*).
* **🏛️ Institutional Stall Booking System:** Custom form for schools, colleges, and event coordinators in Tricity to request a free bookstall setup.
* **🛡️ Admin Management Dashboard:** Password-protected portal to manage book listings, edit stock counts, toggle Kids Section highlights, and approve institutional stall requests.

---

## 📂 Project Structure

```text
TricityBookstall/
├── server/                     # NestJS TypeScript REST API (Port 5001)
│   ├── src/
│   │   ├── books/              # Books controller, service & data models
│   │   ├── bookings/           # Institutional stall requests controller & service
│   │   ├── events/             # Campus events controller & service
│   │   ├── auth/               # Admin authentication service
│   │   ├── app.module.ts       # Root module
│   │   └── main.ts             # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── client/                     # React.js + Vite + Tailwind CSS (Port 3000)
│   ├── src/
│   │   ├── components/         # Navbar, Hero, KidsSection, BooksCatalog, EventsGallery, HostStallModal, AdminDashboard, Footer
│   │   ├── services/api.js     # Axios API service layer connecting to NestJS
│   │   ├── App.jsx             # Main container
│   │   ├── main.jsx            # React root entry
│   │   └── index.css           # Custom styles & design system
│   ├── public/assets/          # Local event photos & brand assets
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
* **Node.js** (v18.x or higher)
* **npm** (v9.x or higher)

---

### Step 1: Start NestJS Backend Server

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the backend API server:
   ```bash
   npm start
   ```
   * The NestJS REST API will run at **`http://localhost:5001/api`**.
   * Test endpoint: `http://localhost:5001/api/books`

---

### Step 2: Start React Frontend Web Application

1. Open a second terminal window and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   * Open your browser and go to **`http://localhost:3000`**.

---

## 🛡️ Admin Portal Credentials

Click the **Shield Icon** at the top right of the navigation bar to log in:
* **Username:** `admin`
* **Password:** `admin123`

---

## 🚀 Production Deployment Guide

### 1. Deploying the React Frontend (Vercel / Netlify / Cloudflare Pages)

#### Option A: Deploy on Vercel (Recommended for React)
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `client`.
5. Set Build Settings:
   * **Framework Preset:** Vite
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
6. Click **Deploy**.

#### Option B: Deploy on Netlify
1. Log in to [Netlify](https://www.netlify.com/).
2. Select **Add new site** > **Import an existing project**.
3. Set **Base directory** to `client`.
4. Set **Build command** to `npm run build`.
5. Set **Publish directory** to `client/dist`.
6. Click **Deploy**.

---

### 2. Deploying the NestJS Backend Server (Render / Railway / DigitalOcean)

#### Option A: Deploy on Render (Free Node.js Hosting)
1. Log in to [Render](https://render.com/).
2. Create a **New Web Service** and link your repository.
3. Set the **Root Directory** to `server`.
4. Build & Start Commands:
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm run start:prod` or `node dist/main.js`
5. Environment Variables:
   * `PORT`: `5001` (or Render default)
6. Copy the deployed backend API URL (e.g. `https://tricity-bookstall-api.onrender.com`).

#### Option B: Connect Frontend to Production Backend
In `client/src/services/api.js`, update `API_BASE` to point to your live NestJS backend URL:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'https://your-backend-api.onrender.com/api';
```

---

### 3. Connecting Custom Domain (`tricitybookstall.me`)

If you own `tricitybookstall.me`:

1. In **Vercel** or **Netlify**, go to **Project Settings > Domains**.
2. Add `tricitybookstall.me` and `www.tricitybookstall.me`.
3. Update your DNS settings at your domain registrar (Namecheap/GoDaddy/Cloudflare):
   * **A Record:** `@` -> `76.76.21.21` (Vercel IP)
   * **CNAME Record:** `www` -> `cname.vercel-dns.com`
4. SSL/TLS certificate will automatically generate within minutes!

---

### 4. Deploying to Appwrite Cloud (GitHub Student Developer Pack)

If you have the **GitHub Student Developer Pack**, you can deploy and host your web application on **Appwrite Cloud** with free Pro plan credits.

#### Step 1: Claim GitHub Student Pack Benefit
1. Go to **[cloud.appwrite.io](https://cloud.appwrite.io)** and log in with your **GitHub account**.
2. Go to **Organization Settings** > **Billing & Subscriptions**.
3. Select the **Pro Plan** and redeem your **GitHub Student Developer Pack** discount/coupon.

---

#### Step 2: Deploy React Frontend on Appwrite Sites (Hosting)
1. Push your `TricityBookstall` project to GitHub.
2. In the Appwrite Cloud Console, select your project.
3. In the sidebar, click **Sites** (or **Hosting**).
4. Click **Create Site** and connect your GitHub Repository.
5. Configure project settings:
   * **Root Directory:** `client`
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
   * **Node Version:** `18.x` or `20.x`
6. Click **Deploy**. Appwrite will automatically build and deploy your React site.

---

#### Step 3: Backend Integration Options

##### Option A: Appwrite Serverless Functions (Node.js)
1. Install Appwrite CLI:
   ```bash
   npm install -g appwrite-cli
   ```
2. Initialize Appwrite Functions:
   ```bash
   appwrite login
   appwrite init function
   ```
3. Deploy function endpoints to Appwrite Cloud:
   ```bash
   appwrite deploy function
   ```

##### Option B: Appwrite Native Database & Auth (Zero Backend Code)
* You can use **Appwrite Databases** to store your `books`, `events`, and `bookings` tables, and **Appwrite Auth** for admin login directly from React using `@appwrite.io/pink` or `appwrite` JS SDK.

---

## 📜 License & Credits

* **Initiative:** Prabodhanam Tricity Wisdom Bookstall
* **Tech Stack:** React.js, NestJS, Appwrite Cloud, Tailwind CSS, Lucide Icons, Framer Motion, Canvas Confetti.
* **Target Cities:** Chandigarh, Mohali, Panchkula.
