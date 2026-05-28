# Changelog

All notable changes to the Links Keeper project are documented in this file.

---

## [1.1.0] - 2026-05-28

### Added
- **Link Editing**: Enabled full link editing capabilities from the settings menu of `LinkCard.tsx`, utilizing `AddLinkModal.tsx` in update mode.
- **Safety Confirmation Modal (`ConfirmModal.tsx`)**:
  - Warns before deleting links ("האם אתה בטוח שברצונך למחוק...").
  - Warns before deleting categories ("האם אתה בטוח שברצונך למחוק את הקטגוריה...").
- **Discard Unsaved Changes Warning**: Triggers a modal popup warning if there are unsaved modifications in the Link or Category forms when trying to close them without saving.
- **Mobile-Friendly Category Addition**: Added a quick `+` button in the mobile categories bar.

### Changed
- **Compact vs. Detailed Layouts**:
  - Grid view is now the **Detailed Layout** containing title, link, tags, and description.
  - List view is now the **Compact Layout**, hiding descriptions and tags to display only the title and link badge.
- **Dynamic Categories**: Removed seed/dummy default categories; categories are now completely user-managed.

### Removed
- **Search Capability**: Removed the search input field and search icon completely from the header and core app logic.

---

## [1.0.0] - 2026-05-28

### Added
- **Firebase Firestore Backend**: Migrated application from local storage database to Google Firebase Firestore.
- **Realtime Listener Hook (`useLinks.ts`)**: Built real-time listener handlers using Firestore `onSnapshot`.
- **Progressive Web App (PWA)**:
  - Custom service worker (`sw.js`) with network-first strategies.
  - Modern web manifest configuration with portrait support, Hebrew localization, and theme alignment.
  - High-res neo-brutalist icons (SVG and PNG formats).
- **Tag Filtering System**: Horizontal tag chips component (`TagFilter.tsx`) to filter category links by selecting tags.
- **Mobile Optimizations**: Custom inputs (`font-size: 16px` to prevent iOS zoom), bottom sheets for modals, safe area paddings, and larger touch areas.
- **Firebase Hosting Config**: Configured hosting redirects and deployed live production builds to `links-keeper-99871.web.app`.

### Changed
- Refactored project directory structure, cleaned up unused packages/dependencies (removed Express, Dotenv, Esbuild, TSX, Google GenAI SDK).
