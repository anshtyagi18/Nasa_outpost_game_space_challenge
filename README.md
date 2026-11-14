<div align="center">

# 🚀 ARES KIDS: Survival on Sol-7
### *An Interactive Space Survival & Educational Game for the NASA Space Apps Challenge*
**Designed for Junior Astronauts (Ages 7–12) • Inspired by 'Reigns' & 'Save the Girl' Choice Dilemmas**

[![NASA Space Apps](https://img.shields.io/badge/NASA%20Space%20Apps-Challenge%202024-0b3d91?style=for-the-badge&logo=nasa&logoColor=white)](https://www.spaceappschallenge.org/)
[![Target Audience](https://img.shields.io/badge/Audience-Kids%20Ages%207--12-fc3d21?style=for-the-badge)](https://nasa.gov)
[![Stream Video](https://img.shields.io/badge/Stream%20Video-Direct%20in%20Browser-e11d48?style=for-the-badge&logo=youtube&logoColor=white)](https://github.com/anshtyagi18/Nasa_outpost_game_space_challenge/blob/main/demo/ares-kids-demo.mp4)
[![Vite + React](https://img.shields.io/badge/React%2019-Vite%208-06b6d4?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

**"Guide Commander Maya, rover bot SPARK-E, and Sprout the radish plant through 7 unpredictable Sols on Mars or the Moon using real NASA aerospace engineering and space weather science!"**

[🎬 Stream Demo Video](#-gameplay-demo-video) • [🎮 Game Features](#-core-game-features) • [🛰️ Real NASA Science](#-real-nasa-apis--datasets) • [🖨️ Printable Diploma](#-1-page-printable-mission-diploma) • [🚀 Quick Start](#-quick-start)

</div>

---

## 🎬 Gameplay Demo Video

Watch the full interactive walkthrough of **ARES KIDS: Survival on Sol-7** in action, featuring the character stage, choice dilemma trade-offs, live NASA telemetry drawer, and the printable mission certificate.

### 🌐 Direct Browser Streaming Links (No Download Required):

- 📺 **[▶️ Open Video Directly in GitHub Player](https://github.com/anshtyagi18/Nasa_outpost_game_space_challenge/blob/main/demo/ares-kids-demo.mp4)** *(Plays natively right inside your browser window)*
- 🌐 **[▶️ Stream Raw Video in Browser Player](https://anshtyagi18.github.io/Nasa_outpost_game_space_challenge/ares-kids-demo.mp4)** *(Opens full-screen HTML5 video player in your browser tab)*

---

## 🎮 Core Game Features

### 1. In-App Video Walkthrough Modal
- Added an interactive **"DEMO VIDEO"** button directly inside the game header and start screen.
- Anyone testing the app can watch the high-definition 1080p demo walkthrough inside an integrated modal window with zero external downloads.

### 2. 7-Sol Dynamic Story & Trade-off Engine
- Every playthrough randomly selects **7 unique scenarios** out of 10 rich NASA-backed dilemmas.
- **No Free Choices!** Kids learn real mission planning trade-offs:
  - Diverting power to shields drains life support lamps.
  - Pumping drinking water into habitat walls blocks radiation but threatens the hydroponic garden.
  - Hovering or touching any choice displays real-time **pulsing preview arrows** (`▲+25`, `▼-15`) on the top progress bars.
- Plain-language **Kid Science Pop-up Facts** after every decision (explaining *Sol*, *mSv*, *CME*, *Whipple Shielding*, and *Hydroponics* in 1 punchy sentence).

### 3. Animated Cartoon Habitat Stage (`HabitatStage.jsx`)
- **Commander Maya**: Shivers with animated frost particles when Power drops below 35%.
- **SPARK-E (Rover Bot)**: Spins with red siren lights when a Solar Storm hits.
- **Sprout (Hydroponic Radish Plant)**: Droops and turns yellow when life support drops below 35%.
- Dynamic sky and atmospheric changes for **Mars Jezero Crater Outpost** vs. **Moon Artemis Base Camp**.

### 4. Procedural Web Audio Synthesizer (`sound.js`)
- Zero external audio libraries — procedural sound synthesis built with the **Web Audio API**:
  - `playClick()`: Playful pop for button taps.
  - `playAlarm()`: Multi-tone sci-fi siren for incoming DONKI solar flares.
  - `playSuccess()`: 4-note cheerful chime upon Sol survival.
  - `playDamage()`: Filtered low rumble when a system meter enters critical condition.
  - `playVictory()` / `playGameOver()`: Fanfare and descending emergency tones.
  - Persistent audio toggle in the navbar.

---

## 🛰️ Real NASA APIs & Datasets

Connected directly via our NASA API Key (`cp79...hpgF`) with **instant offline fallback**:

| NASA Resource | Integration in Game | Live Status |
| :--- | :--- | :---: |
| **NASA DONKI Space Weather** | Live Solar Flares (`/DONKI/FLR`) & Coronal Mass Ejections (`/DONKI/CME`) | 🟢 Live / 📁 Curated |
| **NASA APOD & Mars Imagery** | Astronomy Picture of the Day & Perseverance landing site photography | 🟢 Live / 📁 Curated |
| **NASA RadLab MSL-RAD** | Real Martian surface radiation telemetry (~0.7 mSv/day vs Earth ~0.0082 mSv/day) | Verified |
| **NASA OSDR Study OSD-379** | Biological radish growth on the ISS (HATCH experiment) | Verified |
| **NASA Mars Trek (Jezero)** | 3D Interactive Map coordinates (`10.195°N, -1.406°E`) | Verified |
| **CSA Food Production Toolkit** | Controlled closed-loop microgravity food systems | Verified |

Click the **"📡 NASA TELEMETRY"** glowing button in the game header at any time to open the judge's science verification drawer!

---

## 🖨️ 1-Page Printable Mission Diploma

Upon surviving Sol-7, players unlock an official **Diploma of Planetary Survival & Habitat Engineering**:
- **Personalized Astronaut Name**: Kids can type their own name directly in the toolbar to customize the certificate.
- **High-Contrast Design**: Formatted with crisp black/navy typography, gold insignia, and official seal.
- **Guaranteed Single Page**: Built with strict `@media print` isolation rules so clicking **"Print 1-Page Certificate"** (or `Ctrl+P`) fits cleanly onto **exactly 1 sheet of paper** in landscape orientation.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm / yarn

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/anshtyagi18/Nasa_outpost_game_space_challenge.git
cd Nasa_outpost_game_space_challenge

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser at `http://localhost:5173/` and blast off! 🌟
