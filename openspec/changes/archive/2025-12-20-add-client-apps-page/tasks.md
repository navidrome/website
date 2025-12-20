## 1. Data Structure
- [x] 1.1 Create `apps/_template/index.yaml` with final schema (simplified fields)
- [x] 1.2 Create contribution guidelines in `apps/README.md`

## 2. Hugo Page Setup
- [x] 2.1 Create `content/en/apps/_index.md` with front matter (menu weight: 15, between Demo and Docs)
- [x] 2.2 Create `layouts/apps/list.html` that loads and sorts app YAML files
- [x] 2.3 Create `layouts/partials/app-card.html` for individual app rendering

## 3. Styling
- [x] 3.1 Add responsive grid CSS to `assets/scss/_styles_project.scss`
- [x] 3.2 Style app cards (thumbnail, name, description, platform icons, badges)
- [x] 3.3 Style lightbox modal

## 4. Lightbox Gallery
- [x] 4.1 Create `static/js/app-gallery.js` for modal open/close and navigation
- [x] 4.2 Create `layouts/partials/app-gallery.html` for modal markup
- [x] 4.3 Include gallery partial and JS in apps layout

## 5. Sample Data & Testing
- [x] 5.1 Add 3 real app entries (DSub, play:Sub, SubStreamer) with screenshots
- [x] 5.2 Test responsive layout at all breakpoints (desktop 4-col, tablet 3-col, mobile 1-col)
- [x] 5.3 Test lightbox gallery navigation (next/prev, keyboard ESC)
- [x] 5.4 Verify alphabetical sorting

## 6. Documentation
- [x] 6.1 Create `assets/apps/README.md` with complete contribution instructions
- [x] 6.2 Document screenshot requirements (sizes, formats)
