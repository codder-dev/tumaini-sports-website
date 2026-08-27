
// ============================================================
//  GALLERY JAVASCRIPT 
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ---- GET ALL GALLERY ITEMS ----
    const galleryItems = document.querySelectorAll('.gallery-item');
    const totalPhotos = galleryItems.length;

    // ---- UPDATE PHOTO COUNT ----
    const photoCount = document.getElementById('photoCount');
    if (photoCount) {
        photoCount.textContent = totalPhotos;
    }

    // ---- UPDATE FILTER COUNT ON FILTER CHANGE ----
    function updateFilterCount() {
        const visibleItems = document.querySelectorAll('.gallery-item[style*="display: block"]');
        const count = visibleItems.length;
        if (photoCount) {
            photoCount.textContent = count;
        }
    }

    // ---- FILTER FUNCTION ----
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            updateFilterCount();
            resetLoadMore();
        });
    });

    // ---- LOAD MORE FUNCTIONALITY ----
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    let itemsToShow = 12;
    const itemsPerLoad = 6;

    function initGallery() {
        const items = document.querySelectorAll('.gallery-item');
        const filter = document.querySelector('.filter-btn.active').getAttribute('data-filter');

        let visibleCount = 0;
        items.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const isVisible = (filter === 'all' || category === filter);

            if (isVisible) {
                if (index < itemsToShow) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            } else {
                item.style.display = 'none';
            }
        });

        updateFilterCount();

        // Show/hide load more button
        const totalVisible = document.querySelectorAll('.gallery-item[style*="display: block"]').length;
        const allVisibleItems = document.querySelectorAll('.gallery-item');
        let totalFiltered = 0;
        allVisibleItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                totalFiltered++;
            }
        });

        if (totalVisible >= totalFiltered || totalFiltered <= 12) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'block';
        }
    }

    function resetLoadMore() {
        const filter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const items = document.querySelectorAll('.gallery-item');
        let totalFiltered = 0;

        items.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                totalFiltered++;
            }
        });

        itemsToShow = 12;

        if (totalFiltered <= 12) {
            loadMoreContainer.style.display = 'none';
            items.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                }
            });
        } else {
            loadMoreContainer.style.display = 'block';
            let count = 0;
            items.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    if (count < 12) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                    count++;
                }
            });
        }

        updateFilterCount();
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const filter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            const items = document.querySelectorAll('.gallery-item');
            let count = 0;
            let visibleCount = 0;

            items.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                const isVisible = (filter === 'all' || category === filter);

                if (isVisible) {
                    if (index < itemsToShow + itemsPerLoad) {
                        item.style.display = 'block';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                    count++;
                } else {
                    item.style.display = 'none';
                }
            });

            itemsToShow += itemsPerLoad;
            updateFilterCount();

            // Hide load more if all visible
            if (visibleCount >= count) {
                loadMoreContainer.style.display = 'none';
            }
        });
    }

    // ---- LIGHTBOX FUNCTIONALITY ----
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    let currentIndex = 0;
    let currentItems = [];

    // Get all visible gallery items
    function getVisibleItems() {
        const items = document.querySelectorAll('.gallery-item[style*="display: block"]');
        return Array.from(items);
    }

    // Open lightbox
    function openLightbox(index) {
        currentItems = getVisibleItems();
        if (currentItems.length === 0) return;

        currentIndex = index;
        const item = currentItems[index];
        const image = item.querySelector('.gallery-item-image');
        const info = item.querySelector('.gallery-item-info');
        const title = info.querySelector('h4').textContent;
        const description = info.querySelector('p').textContent;
        const category = item.getAttribute('data-category');
        const bgImage = image.style.backgroundImage.slice(5, -2).replace(/["']/g, '');

        // Set lightbox content
        lightboxImage.src = bgImage;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightboxCategory.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        lightboxCategory.className = 'lightbox-category ' + category;

        // Update counter
        lightboxCounter.textContent = (index + 1) + ' / ' + currentItems.length;

        // Show/hide navigation buttons
        prevBtn.style.display = index > 0 ? 'flex' : 'none';
        nextBtn.style.display = index < currentItems.length - 1 ? 'flex' : 'none';

        // Show lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Navigate lightbox
    function navigateLightbox(direction) {
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < currentItems.length) {
            openLightbox(newIndex);
        }
    }

    // ---- LIGHTBOX EVENT LISTENERS ----
    // Click on gallery item to open lightbox
    galleryItems.forEach((item) => {
        item.addEventListener('click', function() {
            // Get the visible items and find this item's index
            const visibleItems = getVisibleItems();
            const idx = visibleItems.indexOf(this);
            if (idx !== -1) {
                openLightbox(idx);
            }
        });
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            navigateLightbox(-1);
        });
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            navigateLightbox(1);
        });
    }

    // Close on outside click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        }
    });

    // ---- INITIALIZE ----
    initGallery();

});
