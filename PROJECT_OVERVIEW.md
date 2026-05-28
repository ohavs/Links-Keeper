# 🔗 Links Keeper - Project Overview

Links Keeper is a highly interactive, neo-brutalist styled Progressive Web Application (PWA) designed to store, organize, and manage web links and bookmarks in real-time. It is optimized for mobile screens as a standalone web application and features a cloud-synced database backend.

---

## 🛠️ Technology Stack

- **Frontend Core**: React (TypeScript) + Vite
- **Styling**: Modern Neo-Brutalist CSS System (custom CSS variables, high-contrast borders, raw design details)
- **Icons**: Lucide React
- **Backend / DB**: Firebase Firestore (Realtime Sync & listeners)
- **Hosting**: Firebase Hosting (`links-keeper-99871.web.app`)
- **PWA Features**: Service Workers (asset caching & custom offline strategies), Web App Manifest

---

## 🔑 Key Features

### 1. Real-Time Cloud Sync
- Built-in Firestore integration with real-time snapshot listeners.
- Links and categories update immediately across all connected client devices without refreshing.

### 2. Category Management
- Fully dynamic custom categories (create and delete categories on the fly).
- Each category has its own name and custom preset color selector.
- Deleting a category uses batch Firestore operations to automatically delete all links belonging to that category.
- Drag-and-drop support (via `@dnd-kit/core`) to move links between categories easily on desktop/tablet.

### 3. Link Management & Editing
- Add links with URL, title, tags, description, and target category.
- Custom styled category selector dropdowns with color-coded dot badges.
- Edit existing links directly through the card actions menu.

### 4. Interactive Tag Filtering
- Horizontal scrolling tag bar displaying all unique tags for the active category.
- Fast tag-chip filtering (clicking tags filters links belonging to that category).

### 5. Layout Modes (Compact vs. Detailed)
- **Detailed Layout (Grid)**: Shows title, hostname badge, tags, and description.
- **Compact Layout (List)**: Shows *only* the title and host link, rendering as a single row. Description and tags are hidden to keep the display clean.

### 6. Safety Warnings & Confirmations
- Reusable `ConfirmModal` alert before any critical action:
  - Deleting a link.
  - Deleting a category.
- Unsaved changes prompt if closing the Category Modal or Link Modal (via "X", backdrop, or cancel) after fields have been modified.

### 7. Progressive Web App (PWA)
- Installable on iOS, Android, and Desktop.
- Service worker using a network-first strategy for Firebase resources and cache-first for static local assets.
- Responsive, mobile-first design targeting standard safe areas and inputs optimized to prevent automatic iOS zoom.
