// Wallpaper Data
const wallpapers = [
    { id: 2, title: "Misty Mountains", category: "Nature", resolution: "HD", src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80" },
    { id: 21, title: "Linux Distro", category: "Linux", resolution: "4K", src: "uwp4876369.png" },
    { id: 4, title: "McLaren P1", category: "Cars", resolution: "4K", src: "https://pixelz.cc/wp-content/uploads/2023/11/mclaren-artura-trophy-uhd-4k-wallpaper.jpg" },
    { id: 22, title: "Tux Minimal", category: "Linux", resolution: "4K", src: "uwp4876370.png" },
    { id: 5, title: "Minimal Abstract", category: "Minimal", resolution: "4K", src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80" },
    { id: 23, title: "Arch Linux", category: "Linux", resolution: "4K", src: "uwp4876371.png" },
    { id: 6, title: "Deep Space", category: "Space", resolution: "8K", src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
    { id: 24, title: "Kali Dragon", category: "Linux", resolution: "4K", src: "uwp4876372.png" },
    { id: 7, title: "Asta Black-Clover", category: "Anime", resolution: "HD", src: "https://4kwallpapers.com/images/walls/thumbs_2t/22972.jpg" },
    { id: 25, title: "System Code", category: "Linux", resolution: "4K", src: "uwp4876373.png" },
    { id: 10, title: "Forest Path", category: "Nature", resolution: "HD", src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80" },
    { id: 26, title: "Debian Swirl", category: "Linux", resolution: "4K", src: "uwp4876374.png" },
    { id: 11, title: "JDM Legend", category: "Cars", resolution: "4K", src: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80" },
    { id: 27, title: "Ubuntu Splash", category: "Linux", resolution: "4K", src: "uwp4876375.png" },
    { id: 13, title: "Clean Desk", category: "Minimal", resolution: "4K", src: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80" },
    { id: 28, title: "Fedora Blue", category: "Linux", resolution: "4K", src: "uwp4876376.png" },
    { id: 14, title: "Nebula", category: "Space", resolution: "4K", src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80" },
    { id: 29, title: "Linux Mint", category: "Linux", resolution: "4K", src: "uwp4876377.png" },
    { id: 17, title: "Winter Snow", category: "Nature", resolution: "4K", src: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80" },
    { id: 7, title: "Luffy One-Piece", category: "Anime", resolution: "HD", src: "https://4kwallpapers.com/images/walls/thumbs_2t/22500.jpg" },
    { id: 18, title: "Ferrari", category: "Cars", resolution: "HD", src: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800&q=80" },
    { id: 7, title: "Sung JinWoo", category: "Anime", resolution: "HD", src: "https://4kwallpapers.com/images/walls/thumbs/19518.png" },
    { id: 20, title: "White Space", category: "Minimal", resolution: "4K", src: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=800&q=80" }
];

// State
let currentCategory = 'all';
let searchQuery = '';
let likedWallpapers = JSON.parse(localStorage.getItem('athexpix_likes')) || [];

// DOM Elements
const galleryGrid = document.getElementById('wallpaperGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const loadingSpinner = document.getElementById('loading');
const noResults = document.getElementById('noResults');

const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalResolution = document.getElementById('modalResolution');
const modalLikeBtn = document.getElementById('modalLikeBtn');
const modalDownloadBtn = document.getElementById('modalDownloadBtn');
const closeModal = document.querySelector('.close-modal');

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderWallpapers();
    setupEventListeners();
});

// Render Function
function renderWallpapers() {
    // Show Loading
    galleryGrid.innerHTML = '';
    loadingSpinner.classList.remove('hidden');
    noResults.classList.add('hidden');

    // Filter Data
    let filteredData = wallpapers.filter(item => {
        const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Simulate Network Delay for smooth feel
    setTimeout(() => {
        loadingSpinner.classList.add('hidden');

        if (filteredData.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }

        filteredData.forEach(wallpaper => {
            const card = document.createElement('div');
            card.className = 'card animate-up';
            card.innerHTML = `
                <img src="${wallpaper.src}" alt="${wallpaper.title}" loading="lazy">
                <div class="card-overlay">
                    <div class="card-info">
                        <h3>${wallpaper.title}</h3>
                        <p>${wallpaper.category} • ${wallpaper.resolution}</p>
                    </div>
                    <div class="card-actions">
                        <button class="card-btn download-btn" onclick="downloadWallpaper('${wallpaper.src}')">
                            <i class="fa-solid fa-download"></i>
                        </button>
                        <button class="card-btn like-btn ${isLiked(wallpaper.id) ? 'liked' : ''}" onclick="toggleLike(${wallpaper.id}, this)">
                            <i class="${isLiked(wallpaper.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                    </div>
                </div>
            `;

            // Open Modal on click (excluding buttons)
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    openModal(wallpaper);
                }
            });

            galleryGrid.appendChild(card);
        });
    }, 400); // 400ms delay
}

// Event Listeners
function setupEventListeners() {
    // Category Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active Class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update State
            currentCategory = btn.dataset.category;
            renderWallpapers();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderWallpapers();
    });

    // Modal Close
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close Modal on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.classList.remove('show');
        }
    });

    // Smooth Scroll for "Explore" button
    window.scrollToGallery = function () {
        document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    }
}

// Modal Logic
let currentModalId = null;

function openModal(wallpaper) {
    modalImage.src = wallpaper.src.replace('&w=800', '&w=1600'); // Higher text for preview
    modalTitle.textContent = wallpaper.title;
    modalCategory.textContent = wallpaper.category;
    modalResolution.textContent = wallpaper.resolution;

    // Update Like Button in Modal
    currentModalId = wallpaper.id;
    updateModalLikeBtn(wallpaper.id);

    // Update Download Button
    modalDownloadBtn.onclick = () => downloadWallpaper(wallpaper.src);

    modal.classList.add('show');
}

// Like Feature
function isLiked(id) {
    return likedWallpapers.includes(id);
}

function toggleLike(id, btnElement) {
    if (likedWallpapers.includes(id)) {
        likedWallpapers = likedWallpapers.filter(itemId => itemId !== id);
        if (btnElement) {
            btnElement.classList.remove('liked');
            btnElement.querySelector('i').classList.replace('fa-solid', 'fa-regular');
        }
    } else {
        likedWallpapers.push(id);
        if (btnElement) {
            btnElement.classList.add('liked');
            btnElement.querySelector('i').classList.replace('fa-regular', 'fa-solid');
        }
    }

    // Save to LocalStorage
    localStorage.setItem('athexpix_likes', JSON.stringify(likedWallpapers));

    // If modal is open, update its button too
    if (modal.classList.contains('show') && currentModalId === id) {
        updateModalLikeBtn(id);
    }
}

// Like Button in Modal
modalLikeBtn.addEventListener('click', () => {
    if (currentModalId) {
        toggleLike(currentModalId, null);
        updateModalLikeBtn(currentModalId);
        // Refresh grid icons if visible
        renderWallpapers();
    }
});

function updateModalLikeBtn(id) {
    if (isLiked(id)) {
        modalLikeBtn.classList.add('liked');
        modalLikeBtn.querySelector('i').classList.replace('fa-regular', 'fa-solid');
    } else {
        modalLikeBtn.classList.remove('liked');
        modalLikeBtn.querySelector('i').classList.replace('fa-solid', 'fa-regular');
    }
}

// Download Feature
window.downloadWallpaper = function (url) {
    // For cleaner download, we open in new tab for this demo
    // Start automatic download would require backend or blob fetching
    const win = window.open(url, '_blank');
    win.focus();
}

// Theme Toggle (Bonus visual only for now)
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    const icon = themeToggle.querySelector('i');
    if (icon.classList.contains('fa-moon')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        // Logic for light mode could go here
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});
