# 🦊 British Wildlife Centre - Vanilla PWA

A Progressive Web Application showcasing British wildlife and conservation efforts, built with vanilla HTML, CSS, and JavaScript.

## ✅ **Phase 1 Complete: Foundation**

### What We've Built

#### 📁 **Project Structure**
```
APPLICATION_01/
├── index.html              ✅ Home page with semantic HTML
├── data/
│   ├── animals.json        ✅ 12 British animals with details
│   └── events.json         ✅ 12 events (adult/family/children)
├── css/
│   ├── base.css           ✅ Variables, reset, typography, utilities
│   ├── navigation.css     ✅ Mobile & desktop navigation
│   └── home.css           ✅ Home page specific styles
├── js/
│   ├── app.js             ✅ Main app initialization
│   ├── theme.js           ✅ Light/dark mode toggle
│   ├── network-status.js  ✅ Online/offline detection
│   └── home.js            ✅ Featured animals & events
└── images/
    ├── logo.svg           ✅ Placeholder logo
    └── README.md          ✅ Image requirements guide
```

---

## 🎯 **Features Implemented**

### ✅ **Responsive Navigation**
- **Mobile**: Fixed bottom navigation bar (5 items)
- **Tablet/Desktop**: Sticky top navigation bar
- Smooth transitions between breakpoints
- Active page highlighting

### ✅ **Light/Dark Mode**
- System preference detection
- Manual toggle switch
- Persistent user preference (localStorage)
- Smooth theme transitions
- Updates meta theme-color for mobile

### ✅ **Network Status Monitoring**
- Online/offline indicator
- Network Information API integration
- Toast notifications for status changes
- Connection quality detection (4G, 3G, etc.)

### ✅ **Semantic HTML**
- Header, nav, main, section, article, footer
- Proper heading hierarchy
- ARIA labels and roles
- Accessibility features

### ✅ **Mobile-First CSS**
- CSS custom properties (variables)
- Flexible grid layouts
- Responsive typography
- Utility classes

---

## 🎨 **Design System**

### **Color Palette**
- Primary: `#2d5016` (Forest Green)
- Secondary: `#8b4513` (Saddle Brown)
- Accent: `#d2691e` (Chocolate)
- Status: Success, Warning, Danger, Info

### **Typography**
- Base Font: System font stack
- Headings: Georgia serif
- Responsive font sizes (0.75rem - 3rem)

### **Spacing Scale**
- xs: 0.25rem → 3xl: 4rem
- Consistent padding and margins

### **Breakpoints**
- Mobile: < 640px (default)
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 📊 **Data Structure**

### **Animals (12 Species)**
Each animal includes:
- ID, name, scientific name
- Image path
- Description (engaging, factual)
- Habitat, diet, conservation status
- Fun fact
- Location (lat, lng, area)
- Endangered level (low/medium/high)

### **Events (12 Events)**
Each event includes:
- ID, title, type (adult/family/children)
- Date, time, duration
- Description, location
- Price, spots available
- Icon emoji

---

## 🚀 **How to Test**

### **Option 1: Live Server (VS Code)**
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

### **Option 2: Python HTTP Server**
```powershell
cd d:\Paid_Assignment\APPLICATION_01
python -m http.server 8000
```
Then open: http://localhost:8000

### **Option 3: Node.js HTTP Server**
```powershell
npx http-server -p 8000
```

---

## ✨ **Test Checklist**

### **Visual Tests**
- [ ] Home page loads correctly
- [ ] Navigation shows at bottom on mobile
- [ ] Navigation shows at top on tablet/desktop
- [ ] Featured animals display in grid
- [ ] Upcoming events display correctly
- [ ] Footer renders properly

### **Functionality Tests**
- [ ] Click navigation links (should navigate)
- [ ] Click theme toggle (should switch light/dark)
- [ ] Network indicator shows online status
- [ ] Click animal card (should redirect to details)
- [ ] Click favourite button (should toggle star)
- [ ] Resize window (responsive behavior)

### **Dark Mode Tests**
- [ ] Toggle dark mode manually
- [ ] Check if system preference is detected
- [ ] Verify theme persists on page reload
- [ ] All colors readable in dark mode

### **Offline Tests**
- [ ] Turn off network (DevTools → Network → Offline)
- [ ] Verify offline indicator appears
- [ ] Check notification appears
- [ ] Turn network back on
- [ ] Verify online notification

---

## 📝 **Next Steps**

### **Phase 2: Remaining Pages**
1. `animals.html` - Full animals list with filters
2. `animal-details.html` - Individual animal page
3. `map.html` - Interactive map with Leaflet.js
4. `tips.html` - Child-friendly wildlife tips
5. `favourites.html` - Saved animals page

### **Phase 3: Advanced Features**
6. Camera integration (take/upload photos)
7. Geolocation on map
8. Responsive images with `<picture>` or `srcset`
9. Search/filter functionality
10. Battery status API

### **Phase 4: PWA Requirements**
11. Create `manifest.json`
12. Create `service-worker.js`
13. Generate app icons
14. HTTPS deployment (Firebase)
15. Lighthouse audit

---

## 🎓 **Learning Outcomes**

### **Skills Demonstrated**
✅ Semantic HTML5
✅ CSS custom properties & theming
✅ Mobile-first responsive design
✅ CSS Grid & Flexbox
✅ Vanilla JavaScript (ES6+)
✅ LocalStorage API
✅ Fetch API (JSON loading)
✅ Network Information API
✅ System preference detection
✅ Event delegation
✅ Modular JavaScript architecture

---

## 📚 **Code Quality**

- **Separation of Concerns**: HTML/CSS/JS separated
- **Reusable Components**: Cards, buttons, utilities
- **Accessibility**: ARIA labels, semantic markup
- **Performance**: Lazy loading, efficient selectors
- **Maintainability**: Clear comments, consistent naming

---

## 🔧 **Technologies Used**

- **HTML5**: Semantic elements, meta tags
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **JavaScript ES6+**: Modules, async/await, arrow functions
- **APIs**: LocalStorage, Network Information, matchMedia
- **No frameworks**: Pure vanilla code

---

## 🎯 **Current Status**

**Phase 1: Complete ✅**
- Foundation structure
- Navigation system
- Theme switching
- Network monitoring
- Home page functionality

**Ready for**: Phase 2 - Additional pages

---

## 💡 **Tips for Development**

1. **Test on Real Devices**: Use mobile phone for actual testing
2. **Use DevTools**: Responsive mode, Network tab, Console
3. **Check Accessibility**: Screen reader, keyboard navigation
4. **Optimize Images**: Compress before adding to `/images`
5. **Progressive Enhancement**: Works without JS, better with it

---

## 📞 **Support**

For issues or questions:
- Check browser console for errors
- Verify file paths are correct
- Ensure JSON files are valid
- Test network connectivity
- Clear cache if styles don't update

---

**Built with ❤️ for wildlife conservation education**
