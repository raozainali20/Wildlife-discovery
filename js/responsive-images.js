// ========================================
// RESPONSIVE-IMAGES.JS - Responsive Image Utilities
// ========================================

/**
 * Generate responsive image HTML with <picture> and srcset
 * @param {string} imagePath - Base image path (without extension)
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - CSS class for styling
 * @param {string} loading - Loading strategy ('lazy' or 'eager')
 * @returns {string} HTML string for responsive image
 */
export function createResponsiveImage(imagePath, alt, className = '', loading = 'lazy') {
  // For placeholder images, return simple img tag
  if (imagePath.includes('placeholder')) {
    return `<img src="${imagePath}" alt="${alt}" class="${className}" loading="${loading}">`;
  }
  
  // Extract path and filename
  const pathParts = imagePath.split('/');
  const filename = pathParts[pathParts.length - 1];
  const basePath = pathParts.slice(0, -1).join('/');
  const [name, ext] = filename.split('.');
  
  // Generate responsive image sources
  return `
    <picture>
      <!-- WebP format for modern browsers -->
      <source 
        type="image/webp"
        srcset="
          ${basePath}/${name}-320.webp 320w,
          ${basePath}/${name}-640.webp 640w,
          ${basePath}/${name}-1024.webp 1024w
        "
        sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1024px">
      
      <!-- AVIF format for best compression (newest browsers) -->
      <source 
        type="image/avif"
        srcset="
          ${basePath}/${name}-320.avif 320w,
          ${basePath}/${name}-640.avif 640w,
          ${basePath}/${name}-1024.avif 1024w
        "
        sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1024px">
      
      <!-- Fallback to original format -->
      <source 
        type="image/${ext}"
        srcset="
          ${basePath}/${name}-320.${ext} 320w,
          ${basePath}/${name}-640.${ext} 640w,
          ${basePath}/${name}-1024.${ext} 1024w,
          ${basePath}/${name}.${ext} 1280w
        "
        sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1024px">
      
      <!-- Final fallback -->
      <img 
        src="${imagePath}" 
        alt="${alt}" 
        class="${className}"
        loading="${loading}"
        decoding="async">
    </picture>
  `;
}

/**
 * Simple srcset for img tag (when <picture> is not needed)
 * @param {string} imagePath - Base image path
 * @param {string} alt - Alt text
 * @param {string} className - CSS class
 * @param {string} loading - Loading strategy
 * @returns {string} HTML string for img with srcset
 */
export function createImageWithSrcset(imagePath, alt, className = '', loading = 'lazy') {
  // For placeholder images, return simple img tag
  if (imagePath.includes('placeholder')) {
    return `<img src="${imagePath}" alt="${alt}" class="${className}" loading="${loading}">`;
  }
  
  const pathParts = imagePath.split('/');
  const filename = pathParts[pathParts.length - 1];
  const basePath = pathParts.slice(0, -1).join('/');
  const [name, ext] = filename.split('.');
  
  return `
    <img 
      src="${imagePath}"
      srcset="
        ${basePath}/${name}-320.${ext} 320w,
        ${basePath}/${name}-640.${ext} 640w,
        ${basePath}/${name}-1024.${ext} 1024w,
        ${basePath}/${name}.${ext} 1280w
      "
      sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1024px"
      alt="${alt}"
      class="${className}"
      loading="${loading}"
      decoding="async">
  `;
}

/**
 * Create responsive background image CSS
 * @param {string} imagePath - Base image path
 * @returns {string} CSS for responsive background
 */
export function createResponsiveBackground(imagePath) {
  if (imagePath.includes('placeholder')) {
    return `background-image: url('${imagePath}');`;
  }
  
  const pathParts = imagePath.split('/');
  const filename = pathParts[pathParts.length - 1];
  const basePath = pathParts.slice(0, -1).join('/');
  const [name, ext] = filename.split('.');
  
  return `
    background-image: url('${imagePath}');
    background-image: 
      image-set(
        url('${basePath}/${name}-320.webp') 1x,
        url('${basePath}/${name}-640.webp') 2x,
        url('${basePath}/${name}-1024.webp') 3x
      );
  `;
}

/**
 * Preload critical images
 * @param {Array<string>} imagePaths - Array of image paths to preload
 */
export function preloadImages(imagePaths) {
  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    
    if (path.includes('.webp')) {
      link.type = 'image/webp';
    } else if (path.includes('.avif')) {
      link.type = 'image/avif';
    }
    
    link.href = path;
    document.head.appendChild(link);
  });
}

/**
 * Apply responsive images to existing img elements
 * @param {string} selector - CSS selector for images to upgrade
 */
export function upgradeImages(selector = 'img[data-responsive]') {
  const images = document.querySelectorAll(selector);
  
  images.forEach(img => {
    const src = img.src || img.dataset.src;
    const alt = img.alt;
    const className = img.className;
    const loading = img.loading || 'lazy';
    
    if (!src) return;
    
    // Create picture element
    const pictureHTML = createResponsiveImage(src, alt, className, loading);
    const template = document.createElement('template');
    template.innerHTML = pictureHTML;
    
    // Replace img with picture
    img.parentElement.replaceChild(template.content.firstElementChild, img);
  });
}

/**
 * Check if WebP is supported
 * @returns {Promise<boolean>}
 */
export async function supportsWebP() {
  if (!window.createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  return createImageBitmap(blob).then(() => true, () => false);
}

/**
 * Check if AVIF is supported
 * @returns {Promise<boolean>}
 */
export async function supportsAVIF() {
  if (!window.createImageBitmap) return false;
  
  const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  const blob = await fetch(avifData).then(r => r.blob());
  
  return createImageBitmap(blob).then(() => true, () => false);
}

// Detect and store format support
let webpSupport = null;
let avifSupport = null;

(async () => {
  webpSupport = await supportsWebP();
  avifSupport = await supportsAVIF();
  
  // Add classes to html element for CSS targeting
  if (webpSupport) document.documentElement.classList.add('webp');
  if (avifSupport) document.documentElement.classList.add('avif');
})();
