# Drishti AI — Campus Safety & Surveillance Frontend

Production-ready, standalone React + TypeScript + Vite frontend for **Drishti AI: Your guardian for Campus Safety & Surveillance**.

Includes real-time CCTV monitoring with AI bounding boxes, interactive 3D digital twin of the SSIPMT Raipur campus, 2D zone schematics, live incident management, and a knowledge-trained campus assistant bot.

---

## 🚀 Quick Start for Teammates

### 1. Requirements
- Node.js 18+ or 20+
- npm or bun

### 2. Installation
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔌 Connecting to Your Team's Backend & AI Model

The application comes pre-configured with a clean service adapter located in `src/services/api.ts`.
By default, if no backend is running, the app runs gracefully using self-contained campus and CCTV simulation data.

### Step 1: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Set your backend API endpoint:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws/detections
```

### Step 2: REST API Endpoints Expected by Frontend
Your backend (FastAPI / Flask / Express / Django) can implement the following optional endpoints:

| Method | Endpoint | Description | Frontend Fallback |
|---|---|---|---|
| `GET` | `/campuses/{campusId}/cameras` | List camera streams and states | `INITIAL_CAMERAS` in `mockData.ts` |
| `GET` | `/campuses/{campusId}/incidents` | Active alerts (falls, loitering, breach) | `INITIAL_INCIDENTS` in `mockData.ts` |
| `POST` | `/incidents/{id}/ack` | Acknowledge/resolve an incident | Updates local state |
| `GET` | `/campuses/{campusId}/zones` | Crowd density & zone threat levels | `INITIAL_ZONES` in `mockData.ts` |

### Step 3: Real-Time Detections (WebSocket)
Connect your YOLO / PyTorch inference loop directly to the WebSocket channel:
```json
{
  "type": "INCIDENT",
  "data": {
    "id": "inc-live-101",
    "cameraId": "cam-ssipmt-01",
    "campusKey": "ssipmt",
    "zone": "Academic Block A",
    "type": "fall_detected",
    "severity": "critical",
    "timestamp": "Just now",
    "confidence": 0.94,
    "bbox": [180, 240, 90, 110],
    "status": "active"
  }
}
```

---

## 📁 Project Architecture & File Tree

```text
├── .env.example                # Environment variables template
├── index.html                  # HTML5 entry with Plus Jakarta Sans & typography
├── package.json                # Dependencies, dev server, build scripts
├── tsconfig.json               # TypeScript ES2022 + JSX configuration
├── vite.config.ts              # Vite + React + Tailwind v4 configuration
├── README.md                   # Complete documentation & backend guide
├── public/                     # Static assets and downloadable zip package
│   └── drishti-ai-frontend.zip # Full downloadable project bundle
└── src/
    ├── main.tsx                # React 19 bootstrap root
    ├── App.tsx                 # Main app router, theme provider, quick-launchers
    ├── index.css               # Tailwind CSS v4 directives & neo-brutalist styling
    ├── types.ts                # TypeScript interfaces (Cameras, Incidents, Zones)
    ├── components/
    │   ├── ShowcaseLanding.tsx # Landing page hero, Raipur campus switcher, stats
    │   ├── DashboardView.tsx   # Security operations console & CCTV monitor
    │   ├── CameraStreamCanvas.tsx # Real-time feed renderer with YOLO bounding boxes
    │   ├── ThreeCampusTwin.tsx # Interactive 3D WebGL Digital Twin (SSIPMT Raipur)
    │   ├── CampusChatbot.tsx   # AI Assistant trained on SSIPMT layout & policies
    │   └── dashboard/
    │       ├── DashboardHeader.tsx     # Console navigation and status telemetry
    │       ├── DashboardSidebar.tsx    # Live incident alerts feed & camera list
    │       ├── RiskAnalyticsCharts.tsx # Crowd saturation & zone telemetry
    │       └── SchematicCampusMap.tsx  # 2D visual schematic map of SSIPMT
    ├── data/
    │   ├── mockData.ts              # Raipur campuses metadata & sample feeds
    │   └── ssipmtCampusKnowledge.ts # Complete SSIPMT building & security knowledge
    ├── services/
    │   └── api.ts                   # Teammate backend API & WebSocket bridge
    └── utils/
        └── audioAlert.ts            # Web Audio API emergency alarm synth
```

---

## 🎨 Design System & Theme
- **Neo-Brutalist Aesthetic**: High-contrast borders (`border-2 border-black`), sharp offset drop-shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`), clean industrial typography.
- **Dynamic Dual Theme**:
  - `yellow-cream` (Cyber/Warm Tactical mode with sunshine yellow accents)
  - `dark` (Stealth Night Operations mode with deep obsidian tones)
- **Persistent Floating Theme Toggle**: Stationed in the bottom-left corner across all views.
- **SSIPMT Raipur Spatial Accuracy**: Modeled faithfully after the physical site layout (Main Gate -> Basketball Court -> Boys Hostel -> Management Block -> Admin Block -> Academic Block -> Central Road Divider -> Medical & Canteen -> Girls Hostel).
