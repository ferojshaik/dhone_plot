// Plot Data - Load from localStorage or use empty array
let plotsData = [];
function loadPlotsData() {
    const stored = localStorage.getItem('plotsData');
    if (stored) {
        plotsData = JSON.parse(stored);
    }
}
loadPlotsData();

// DOM Elements
const plotsGrid = document.getElementById('plotsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const modal = document.getElementById('plotModal');
const modalClose = document.querySelector('.modal-close');
const contactForm = document.getElementById('contactForm');

// Current filter
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPlotsData(); // Reload plots from storage
    renderPlots();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderPlots();
        });
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Modal close
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form submission
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Render Plots
function renderPlots() {
    const filteredPlots = currentFilter === 'all' 
        ? plotsData 
        : plotsData.filter(plot => plot.type === currentFilter);

    plotsGrid.innerHTML = '';

    if (filteredPlots.length === 0) {
        plotsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 3rem; color: var(--text-light);">No plots available in this category.</p>';
        return;
    }

    filteredPlots.forEach(plot => {
        const plotCard = createPlotCard(plot);
        plotsGrid.appendChild(plotCard);
    });
}

// Create Plot Card
function createPlotCard(plot) {
    const card = document.createElement('div');
    card.className = 'plot-card';
    card.innerHTML = `
        <div class="plot-image">
            <span>🏞️</span>
            <span class="plot-badge">${plot.type.charAt(0).toUpperCase() + plot.type.slice(1)}</span>
        </div>
        <div class="plot-content">
            <h3 class="plot-title">${plot.title}</h3>
            <p class="plot-location">📍 ${plot.location}</p>
            <div class="plot-details">
                <div class="plot-detail">
                    <div class="plot-detail-value">${plot.area}</div>
                    <div class="plot-detail-label">Sq. Ft.</div>
                </div>
                <div class="plot-detail">
                    <div class="plot-detail-value">${plot.type}</div>
                    <div class="plot-detail-label">Type</div>
                </div>
            </div>
            <div class="plot-price">${plot.price}</div>
            <div class="plot-actions">
                <button class="btn btn-primary" onclick="viewPlotDetails(${plot.id})">View Details</button>
                <button class="btn btn-secondary" onclick="contactAboutPlot(${plot.id})">Contact</button>
            </div>
        </div>
    `;
    return card;
}

// View Plot Details
function viewPlotDetails(plotId) {
    // Handle both number and string IDs
    const plot = plotsData.find(p => p.id == plotId || p.id === plotId);
    if (!plot) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2 style="margin-bottom: 1rem; color: var(--text-dark);">${plot.title}</h2>
        <p class="plot-location" style="margin-bottom: 1.5rem;">📍 ${plot.location}</p>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: var(--bg-light); padding: 1rem; border-radius: 8px;">
                <div style="font-size: 0.875rem; color: var(--text-light); margin-bottom: 0.5rem;">Area</div>
                <div style="font-size: 1.25rem; font-weight: 600; color: var(--primary-color);">${plot.area} Sq. Ft.</div>
            </div>
            <div style="background: var(--bg-light); padding: 1rem; border-radius: 8px;">
                <div style="font-size: 0.875rem; color: var(--text-light); margin-bottom: 0.5rem;">Type</div>
                <div style="font-size: 1.25rem; font-weight: 600; color: var(--primary-color);">${plot.type.charAt(0).toUpperCase() + plot.type.slice(1)}</div>
            </div>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 0.5rem; color: var(--text-dark);">Price</h3>
            <div style="font-size: 2rem; font-weight: 700; color: var(--secondary-color);">${plot.price}</div>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 0.5rem; color: var(--text-dark);">Description</h3>
            <p style="color: var(--text-light); line-height: 1.8;">${plot.description}</p>
        </div>

        <div style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 0.5rem; color: var(--text-dark);">Key Features</h3>
            <ul style="list-style: none; padding: 0;">
                ${plot.features.map(feature => `
                    <li style="padding: 0.5rem 0; color: var(--text-light);">
                        <span style="color: var(--secondary-color); margin-right: 0.5rem;">✓</span>${feature}
                    </li>
                `).join('')}
            </ul>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button class="btn btn-primary" onclick="contactAboutPlot(${plot.id}); modal.style.display='none';">Contact Us</button>
            <button class="btn btn-secondary" onclick="modal.style.display='none'">Close</button>
        </div>
    `;

    modal.style.display = 'block';
}

// Contact About Plot
function contactAboutPlot(plotId) {
    // Handle both number and string IDs
    const plot = plotsData.find(p => p.id == plotId || p.id === plotId);
    if (!plot) return;

    // Scroll to contact form
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    // Pre-fill message
    const messageField = document.getElementById('message');
    messageField.value = `I'm interested in: ${plot.title} (${plot.location})`;
    messageField.focus();
}

// Initialize EmailJS (You'll need to get your keys from emailjs.com)
// For now, using a simple mailto fallback
function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
        formMessage.textContent = 'Please fill in all required fields (*)';
        formMessage.className = 'form-message error';
        return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formMessage.textContent = '';
    formMessage.className = 'form-message';

    // Create mailto link with form data
    const subject = encodeURIComponent(`Plot Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone || 'Not provided'}\n\n` +
        `Message:\n${formData.message}`
    );
    
    // Open email client
    const mailtoLink = `mailto:shaikferoj327@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    // Show success message
    formMessage.textContent = 'Opening your email client... Please send the email to contact us!';
    formMessage.className = 'form-message success';
    
    // Reset form after a delay
    setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 3000);
}

// Open Video Modal
function openVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoModalIframe');
    
    if (!videoModal || !videoIframe) {
        console.error('Video modal elements not found');
        return;
    }
    
    // Video ID from the YouTube link
    const videoId = 'zRZhkFnde7I';
    const youtubeLink = 'https://www.youtube.com/watch?v=' + videoId;
    
    // Construct proper YouTube embed URL with all necessary parameters
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`;
    
    try {
        // Set iframe source
        videoIframe.src = embedUrl;
        videoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Handle successful load
        videoIframe.onload = () => {
            console.log('Video iframe loaded successfully');
        };
        
        // Handle load errors
        videoIframe.onerror = () => {
            console.error('Failed to load video iframe');
            // Fallback: open YouTube in new tab
            closeVideoModal();
            window.open(youtubeLink, '_blank');
        };
        
    } catch (error) {
        console.error('Error opening video modal:', error);
        // Fallback: open YouTube in new tab
        closeVideoModal();
        window.open(youtubeLink, '_blank');
    }
}

// Close Video Modal
function closeVideoModal() {
    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoModalIframe');
    
    if (videoModal) {
        videoModal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Stop video by clearing src
        if (videoIframe) {
            videoIframe.src = '';
        }
    }
}

// Close video modal when clicking outside
window.addEventListener('click', (e) => {
    const videoModal = document.getElementById('videoModal');
    if (e.target === videoModal) {
        closeVideoModal();
    }
});

// Make functions globally available
window.viewPlotDetails = viewPlotDetails;
window.contactAboutPlot = contactAboutPlot;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;

