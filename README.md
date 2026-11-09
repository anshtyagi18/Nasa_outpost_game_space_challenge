<div align="center">

# 🚀 Space Cadet: Sol Survivors
### *A High-Octane 2D Action Survival Game for the NASA Space Apps Challenge*
**Inspired by CrazyGames 'Space Survivors' • Tailored for Junior Space Cadets (Ages 7–12)**

[![NASA Space Apps](https://img.shields.io/badge/NASA%20Space%20Apps-Challenge%202026-0b3d91?style=for-the-badge&logo=nasa&logoColor=white)](https://www.spaceappschallenge.org/)
[![Target Audience](https://img.shields.io/badge/Audience-Kids%20Ages%207--12-fc3d21?style=for-the-badge)](https://nasa.gov)
[![Live Game](https://img.shields.io/badge/Play%20Online-GitHub%20Pages-22c55e?style=for-the-badge&logo=github)](https://anshtyagi18.github.io/Nasa_outpost_game_space_challenge/)
[![60 FPS Canvas](https://img.shields.io/badge/Engine-HTML5%20Canvas%202D-06b6d4?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

**"Pilot an Explorer Rover across alien Martian terrain. Blast through swarms of space debris and DONKI radiation storms. Salvage power cells and return to Outpost Sol-1 before base life support hits zero!"**

[🕹️ Play Live Demo](https://anshtyagi18.github.io/Nasa_outpost_game_space_challenge/) • [Game Mechanics](#-gameplay--controls) • [NASA Trade-Offs](#-the-core-nasa-engineering-trade-off-mechanic) • [NASA Science Dossier](#-real-nasa-data-grounding) • [Quick Start](#-quick-start--local-installation)

</div>

---

## 🎮 Gameplay & Controls

You pilot a high-speed Lunar/Martian Explorer Rover in a top-down alien arena surrounded by continuous space hazard swarms:

- **Movement:** `[W, A, S, D]` or `Arrow Keys` (or on-screen **Virtual Joystick** on mobile/tablets).
- **Thruster Boost / Dash:** Press `[SPACE]` to trigger invulnerability frames and burst forward with flame trails.
- **Auto-Aiming Defense Turrets:** Rover automatically locks onto and fires neon energy blasts at the closest hazards.
- **Tractor Magnet Field:** Pulls in dropped floating salvage from destroyed hazards.
- **Outpost Sol-1 Central Base:** The central habitat dome has draining **Power (⚡)**, **Oxygen (💨)**, and **Shield (🛡️)** meters. Drive into the central perimeter to deposit salvage and recharge health!

---

## ⚖️ The Core NASA Engineering Trade-Off Mechanic

When you collect enough 🔬 **NASA Data Disks** or survive to a new Sol, the action freezes and presents **3 BIG, Glowing Arcade Choice Cards** with authentic NASA compromises:

| Upgrade Choice Card | Positive Performance Gain (Buff) | Strategic NASA Trade-Off (Cost) | Kid-Friendly NASA Science Fact |
| :--- | :--- | :--- | :--- |
| **☀️ Solar Panel Overcharge** | `+35%` Rover Speed & `+25%` Fire Rate | `-15%` Base Shielding (Thermal Waste) | *NASA solar panels produce up to 120 kW on the ISS, but excess electrical power converts to heat that strains cooling radiators!* |
| **🛡️ Lunar Regolith Bunker** | `+40%` Base Shields & `+25%` Armor | `-15%` Rover Dash Recharging Speed | *Moon and Mars soil ("regolith") is packed with iron and silica. Piling 2 meters of regolith over a habitat stops deadly cosmic rays!* |
| **🌱 Hydroponics UV Boost** | `+35%` Base Oxygen & Food Gen | `-20%` Base Battery Reserve | *NASA's Veggie plant chamber uses tuned red and blue LED wavelengths to grow space salad without natural sunlight, but drinks lots of watts!* |
| **🧲 DONKI Magnet Deflector** | Unlocks Periodic Repulsor Shockwave | `-10%` Max Battery Capacity | *NASA's DONKI watches Coronal Mass Ejections (CMEs). Artificial magnetic fields deflect high-speed protons just like Earth's magnetosphere!* |
| **🔫 Curiosity Plasma Cannons** | `+1` Simultaneous Auto-Targeting Laser | `+10%` Collision Damage From Debris | *NASA's Curiosity and Perseverance rovers carry high-power ChemCam lasers that vaporize rock samples from up to 23 feet away!* |
| **☢️ RTG Nuclear Overdrive** | `+50%` Magnet Range & `+20%` Damage | `-10%` Outpost Shield Integrity | *Radioisotope Thermoelectric Generators (RTGs) turn natural heat from decaying plutonium into electricity, powering rovers for decades in the dark!* |
| **💧 Water-Wall ECLSS Blanket** | Instantly Repairs `40 HP` & `+30` Oxygen | `-10%` Rover Strafe Agility | *Water is full of hydrogen atoms, which are the #1 best atomic shield against cosmic rays. Astronaut sleeping quarters on the ISS are lined with water bags!* |

---

## 🛰️ Real NASA Data Grounding

Every hazard swarm and survival system mirrors published NASA missions:

1. **NASA DONKI (Heliophysics & Space Weather):**
   - **Radiation Clusters & CME Plasma Waves:** Modeled after NASA Space Weather Database notifications. Coronal Mass Ejections and Solar Energetic Particles (SEPs) bombard unshielded Martian environments at thousands of km/s.
2. **NASA Mars InSight & Curiosity Surface Telemetry:**
   - **Solar Dust & Thermal Drops:** Mars rovers face static dust buildup on panels and nighttime drops to -120°C, requiring energy-budget trade-offs between movement and heaters.
3. **NASA OSDR (Open Science Data Repository):**
   - **Microgravity Hydroponics & ECLSS:** Space farming experiments (Veggie / APH) and water recycling loops inspired the Base Oxygen & Food maintenance mechanic.

---

## 🕹️ Visuals & Retro Arcade Feel

- **High-FPS HTML5 Canvas 2D Engine:** Butter-smooth 60+ FPS physics, zero texture loading delay.
- **Dynamic Particle FX:** Thruster exhaust fire, neon bullet impact sparks, hazard shatter explosions, and suction tractor beams.
- **Screen Shake & Floating Numbers:** `+15 ⚡ Power`, `+20 💨 Oxygen`, `-25 HP` combat popups.
- **100% Synthetic Web Audio Engine:** Retro laser pew-pew, thruster whoosh, item collection chimes, and swarm sirens—zero external audio file dependencies.
- **Solar Radar (Top-Right):** Real-time mini-map tracking Outpost Sol-1, your rover, incoming red hazard dots, and dropped salvage.

---

## 🚀 Quick Start & Local Installation

```bash
# 1. Clone the repository
git clone https://github.com/anshtyagi18/Nasa_outpost_game_space_challenge.git
cd Nasa_outpost_game_space_challenge

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The game boots instantly at `http://localhost:3000`.

---

## 📦 Production Build

```bash
npm run build
```
Bundle compiles cleanly to `dist/` in under 3 seconds (**426 kB** optimized single-bundle footprint).

---

<div align="center">
  <sub>Built for the NASA Space Apps Challenge • Dedicated to the Next Generation of Space Explorers</sub>
</div>
