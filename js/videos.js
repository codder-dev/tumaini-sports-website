// ============================================================
//  VIDEOS JAVASCRIPT - Supports Both YouTube & MP4
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ---- GET ALL VIDEO ITEMS ----
    const videoItems = document.querySelectorAll('.video-item');
    const totalVideos = videoItems.length;

    // ---- UPDATE VIDEO COUNT ----
    const videoCount = document.getElementById('videoCount');
    if (videoCount) {
        videoCount.textContent = totalVideos;
    }

    // ---- UPDATE FILTER COUNT ----
    function updateFilterCount() {
        const visibleItems = document.querySelectorAll('.video-item[style*="display: block"]');
        const count = visibleItems.length;
        if (videoCount) {
            videoCount.textContent = count;
        }
    }

    // ---- FILTER FUNCTION ----
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-filter');

            videoItems.forEach(item => {
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
    let itemsToShow = 9;
    const itemsPerLoad = 6;

    function initVideos() {
        const items = document.querySelectorAll('.video-item');
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

        const totalVisible = document.querySelectorAll('.video-item[style*="display: block"]').length;
        const allVisibleItems = document.querySelectorAll('.video-item');
        let totalFiltered = 0;
        allVisibleItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                totalFiltered++;
            }
        });

        if (totalVisible >= totalFiltered || totalFiltered <= 9) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'block';
        }
    }

    function resetLoadMore() {
        const filter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const items = document.querySelectorAll('.video-item');
        let totalFiltered = 0;

        items.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                totalFiltered++;
            }
        });

        itemsToShow = 9;

        if (totalFiltered <= 9) {
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
                    if (count < 9) {
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
            const items = document.querySelectorAll('.video-item');
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

            if (visibleCount >= count) {
                loadMoreContainer.style.display = 'none';
            }
        });
    }

    // ============================================================
    // VIDEO MODAL - SUPPORTS BOTH YouTube & MP4
    // ============================================================

    const modal = document.getElementById('videoModal');
    const modalClose = document.getElementById('modalClose');
    const videoWrapper = document.getElementById('videoWrapper');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalCategory = document.getElementById('modalCategory');
    const modalDate = document.getElementById('modalDate');

    // ---- OPEN VIDEO MODAL ----
    function openVideo(videoItem) {
        if (!videoItem) return;

        const info = videoItem.querySelector('.video-info');
        const titleEl = info.querySelector('h4');
        const descEl = info.querySelector('p');
        const linkEl = info.querySelector('.video-link');
        const category = videoItem.getAttribute('data-category');
        const metaSpans = info.querySelectorAll('.video-meta span');

        const title = titleEl ? titleEl.textContent : 'Video';
        const description = descEl ? descEl.textContent : '';
        const videoUrl = linkEl ? linkEl.getAttribute('data-video') : '';
        const dateText = metaSpans.length > 0 ? metaSpans[0].textContent.trim() : '';

        // Set modal text content
        modalTitle.textContent = title;
        modalDescription.textContent = description;

        // Format category
        const categoryNames = {
            'training': 'Training',
            'matches': 'Matches',
            'highlights': 'Highlights',
            'skills': 'Skills'
        };
        const displayCategory = categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
        modalCategory.textContent = displayCategory;
        modalCategory.className = 'modal-category ' + category;
        modalDate.innerHTML = '<i class="far fa-calendar-alt"></i> ' + dateText;

        // ---- DETECT VIDEO TYPE AND RENDER ----
        if (videoUrl) {
            // Check if it's a YouTube URL
            if (videoUrl.includes('youtube.com/embed') || videoUrl.includes('youtu.be')) {
                // YouTube: Use iframe
                videoWrapper.innerHTML = `
                    <iframe 
                        id="videoFrame"
                        width="100%" 
                        height="100%" 
                        src="${videoUrl}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                `;
            } else {
                // MP4 / Self-hosted: Use video tag
                videoWrapper.innerHTML = `
                    <video id="videoFrame" width="100%" height="100%" controls playsinline autoplay>
                        <source src="${videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
            }
        } else {
            // No video URL - show placeholder
            videoWrapper.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:100%;color:white;background:#1a1a2e;font-size:18px;flex-direction:column;">
                    <i class="fas fa-video-slash" style="font-size:40px;margin-bottom:10px;opacity:0.5;"></i>
                    <span>No video available</span>
                </div>
            `;
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // ---- CLOSE VIDEO MODAL ----
    function closeVideo() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Clear the video wrapper to stop playback
        videoWrapper.innerHTML = '';
    }

    // ---- ADD CLICK EVENTS TO VIDEO ITEMS ----
    videoItems.forEach((item) => {
        // Click on the whole video card
        item.addEventListener('click', function(e) {
            if (this.style.display !== 'none') {
                openVideo(this);
            }
        });

        // Click on the play overlay specifically
        const overlay = item.querySelector('.video-play-overlay');
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const parent = this.closest('.video-item');
                if (parent && parent.style.display !== 'none') {
                    openVideo(parent);
                }
            });
        }
    });

    // ---- MODAL CLOSE BUTTON ----
    if (modalClose) {
        modalClose.addEventListener('click', closeVideo);
    }

    // ---- CLOSE ON OUTSIDE CLICK ----
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeVideo();
            }
        });
    }

    // ---- CLOSE ON ESCAPE KEY ----
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeVideo();
        }
    });

    // ---- INITIALIZE ----
    initVideos();

});