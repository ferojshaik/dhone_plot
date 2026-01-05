// Admin Integration for Main Website
// Check if user is logged in as admin
function checkAdminLogin() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// Show/hide admin link in navigation
function updateAdminNav() {
    const adminNavItem = document.getElementById('adminNavItem');
    if (adminNavItem) {
        if (checkAdminLogin()) {
            adminNavItem.style.display = 'block';
        } else {
            adminNavItem.style.display = 'none';
        }
    }
}

// Get contact info from storage or use defaults
function getContactInfo() {
    const stored = localStorage.getItem('contactInfo');
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        phone: '7013317672',
        email: 'shaikferoj327@gmail.com',
        address: 'Dhone, Teachers Colony\nNandayal District'
    };
}

// Save contact info
function saveContactInfo(info) {
    localStorage.setItem('contactInfo', JSON.stringify(info));
    updateContactDisplay();
}

// Update contact display on page
function updateContactDisplay() {
    const info = getContactInfo();
    
    // Update phone
    const phoneLink = document.querySelector('a[href^="tel:"]');
    if (phoneLink) {
        phoneLink.href = `tel:+91${info.phone}`;
        phoneLink.textContent = info.phone;
    }
    
    // Update email
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.href = `mailto:${info.email}`;
        emailLink.textContent = info.email;
    }
    
    // Update address
    const addressEl = document.querySelector('.contact-item:last-child p');
    if (addressEl && !addressEl.querySelector('a')) {
        addressEl.innerHTML = info.address.replace(/\n/g, '<br>');
    }
}

// Open Admin Modal
function openAdminModal() {
    if (!checkAdminLogin()) {
        if (confirm('You need to login as admin. Go to admin page?')) {
            window.location.href = 'admin.html';
        }
        return;
    }
    
    const modal = document.getElementById('adminModal');
    const modalBody = document.getElementById('adminModalBody');
    
    const contactInfo = getContactInfo();
    
    modalBody.innerHTML = `
        <h2 style="margin-bottom: 1.5rem; color: var(--text-dark);">⚙️ Admin Settings</h2>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Contact Information</h3>
            <form id="contactInfoForm">
                <div class="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" id="adminPhone" value="${contactInfo.phone}" required>
                </div>
                <div class="form-group">
                    <label>Email Address *</label>
                    <input type="email" id="adminEmail" value="${contactInfo.email}" required>
                </div>
                <div class="form-group">
                    <label>Address *</label>
                    <textarea id="adminAddress" rows="3" required>${contactInfo.address}</textarea>
                    <small style="color: var(--text-light);">Use line breaks for multiple lines</small>
                </div>
                <button type="submit" class="btn btn-primary">Save Contact Info</button>
            </form>
        </div>
        
        <div style="border-top: 2px solid var(--bg-light); padding-top: 2rem;">
            <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Plot Photo Upload</h3>
            <p style="color: var(--text-light); margin-bottom: 1rem;">When adding plots in admin panel, you can use image URLs. For local images, upload to a free image hosting service like:</p>
            <ul style="color: var(--text-light); margin-bottom: 1.5rem; padding-left: 1.5rem;">
                <li><a href="https://imgur.com" target="_blank" style="color: var(--primary-color);">Imgur</a> - Free image hosting</li>
                <li><a href="https://imgbb.com" target="_blank" style="color: var(--primary-color);">ImgBB</a> - Free image hosting</li>
                <li><a href="https://cloudinary.com" target="_blank" style="color: var(--primary-color);">Cloudinary</a> - Free tier available</li>
            </ul>
            <div class="form-group">
                <label>Upload Image (Convert to URL)</label>
                <input type="file" id="imageUpload" accept="image/*" onchange="handleImageUpload(event)">
                <div id="imagePreview" style="margin-top: 1rem;"></div>
                <div id="imageUrlResult" style="margin-top: 1rem;"></div>
            </div>
        </div>
        
        <div style="margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--bg-light);">
            <a href="admin.html" class="btn btn-secondary" style="margin-right: 1rem;">Manage Plots</a>
            <button onclick="closeAdminModal()" class="btn btn-secondary">Close</button>
        </div>
    `;
    
    // Handle contact info form
    document.getElementById('contactInfoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newInfo = {
            phone: document.getElementById('adminPhone').value.trim(),
            email: document.getElementById('adminEmail').value.trim(),
            address: document.getElementById('adminAddress').value.trim()
        };
        saveContactInfo(newInfo);
        alert('Contact information updated successfully!');
        closeAdminModal();
    });
    
    modal.style.display = 'block';
}

// Close Admin Modal
function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Handle Image Upload (Convert to Data URL)
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const preview = document.getElementById('imagePreview');
    const result = document.getElementById('imageUrlResult');
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        result.innerHTML = '<p style="color: #ef4444;">File is too large. Please use an image under 5MB.</p>';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        
        // Show preview
        preview.innerHTML = `
            <img src="${dataUrl}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px; box-shadow: var(--shadow);">
        `;
        
        // Show data URL (can be used directly in admin panel)
        result.innerHTML = `
            <div style="background: var(--bg-light); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">Image URL (Data URL):</p>
                <textarea id="imageDataUrl" readonly style="width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 0.875rem; min-height: 100px;">${dataUrl}</textarea>
                <button onclick="copyImageUrl()" class="btn btn-primary btn-small" style="margin-top: 0.5rem;">Copy URL</button>
                <p style="color: var(--text-light); font-size: 0.875rem; margin-top: 0.5rem;">Copy this URL and paste it in the "Image URL" field when adding/editing plots in the admin panel.</p>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

// Copy Image URL
function copyImageUrl() {
    const textarea = document.getElementById('imageDataUrl');
    if (textarea) {
        textarea.select();
        document.execCommand('copy');
        alert('Image URL copied! Paste it in the admin panel when adding plots.');
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const adminModal = document.getElementById('adminModal');
    if (e.target === adminModal) {
        closeAdminModal();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAdminNav();
    updateContactDisplay();
    
    // Handle admin link click
    const adminLink = document.querySelector('a[href="#admin"]');
    if (adminLink) {
        adminLink.addEventListener('click', (e) => {
            e.preventDefault();
            openAdminModal();
        });
    }
});

// Make functions globally available
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.handleImageUpload = handleImageUpload;
window.copyImageUrl = copyImageUrl;

