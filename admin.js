// Admin credentials (Change these to your own!)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadPlots();
    } else {
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
    }
}

// Login function
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        loginMessage.textContent = 'Login successful!';
        loginMessage.className = 'form-message success';
        setTimeout(() => {
            checkAuth();
        }, 500);
    } else {
        loginMessage.textContent = 'Invalid username or password!';
        loginMessage.className = 'form-message error';
    }
});

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    checkAuth();
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Get plots from storage
function getPlots() {
    const plots = localStorage.getItem('plotsData');
    return plots ? JSON.parse(plots) : [];
}

// Save plots to storage
function savePlots(plots) {
    localStorage.setItem('plotsData', JSON.stringify(plots));
    // Also update the main website's plotsData
    if (typeof plotsData !== 'undefined') {
        window.plotsData = plots;
    }
}

// Load and display plots
function loadPlots() {
    const plots = getPlots();
    const plotsList = document.getElementById('plotsList');
    const plotCount = document.getElementById('plotCount');
    
    plotCount.textContent = plots.length;
    
    if (plots.length === 0) {
        plotsList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">No plots added yet. Add your first plot above!</p>';
        return;
    }
    
    plotsList.innerHTML = plots.map((plot, index) => `
        <div class="plot-item">
            <div>
                <h3 style="margin-bottom: 0.5rem;">${plot.title}</h3>
                <p style="color: var(--text-light); margin: 0;">${plot.location} • ${plot.area} Sq. Ft. • ${plot.price}</p>
            </div>
            <div class="plot-actions">
                <button onclick="editPlot(${index})" class="btn btn-secondary btn-small">Edit</button>
                <button onclick="deletePlot(${index})" class="btn btn-danger btn-small">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add/Edit Plot
document.getElementById('plotForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const plotId = document.getElementById('plotId').value;
    const plots = getPlots();
    
    const plotData = {
        id: plotId ? parseInt(plotId) : Date.now(),
        title: document.getElementById('plotTitle').value.trim(),
        location: document.getElementById('plotLocation').value.trim(),
        area: document.getElementById('plotArea').value.trim(),
        price: document.getElementById('plotPrice').value.trim(),
        type: document.getElementById('plotType').value,
        image: document.getElementById('plotImage').value.trim(),
        description: document.getElementById('plotDescription').value.trim(),
        features: document.getElementById('plotFeatures').value.split('\n').filter(f => f.trim()).map(f => f.trim())
    };
    
    const formMessage = document.getElementById('formMessage');
    
    if (plotId) {
        // Edit existing plot
        const index = plots.findIndex(p => p.id === parseInt(plotId));
        if (index !== -1) {
            plots[index] = plotData;
            formMessage.textContent = 'Plot updated successfully!';
            formMessage.className = 'form-message success';
        }
    } else {
        // Add new plot
        plots.push(plotData);
        formMessage.textContent = 'Plot added successfully!';
        formMessage.className = 'form-message success';
    }
    
    savePlots(plots);
    loadPlots();
    resetForm();
    
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 3000);
});

// Edit Plot
function editPlot(index) {
    const plots = getPlots();
    const plot = plots[index];
    
    document.getElementById('plotId').value = plot.id;
    document.getElementById('plotTitle').value = plot.title;
    document.getElementById('plotLocation').value = plot.location;
    document.getElementById('plotArea').value = plot.area;
    document.getElementById('plotPrice').value = plot.price;
    document.getElementById('plotType').value = plot.type;
    document.getElementById('plotImage').value = plot.image || '';
    document.getElementById('plotDescription').value = plot.description;
    document.getElementById('plotFeatures').value = plot.features.join('\n');
    document.getElementById('formTitle').textContent = 'Edit Plot';
    
    // Scroll to form
    document.querySelector('.plot-form').scrollIntoView({ behavior: 'smooth' });
}

// Delete Plot
function deletePlot(index) {
    if (confirm('Are you sure you want to delete this plot?')) {
        const plots = getPlots();
        plots.splice(index, 1);
        savePlots(plots);
        loadPlots();
    }
}

// Reset Form
function resetForm() {
    document.getElementById('plotForm').reset();
    document.getElementById('plotId').value = '';
    document.getElementById('formTitle').textContent = 'Add New Plot';
    document.getElementById('formMessage').textContent = '';
    document.getElementById('formMessage').className = 'form-message';
}

// Initialize
checkAuth();

