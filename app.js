document.addEventListener('DOMContentLoaded', () => {
    
    // --- UTILITIES ---
    const showToast = (msg) => {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
            background: #333; color: white; padding: 10px 20px; border-radius: 50px;
            font-size: 0.85rem; z-index: 3000; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideUp 0.3s ease-out;
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };
    window.showToast = showToast;

    // --- FORM ELEMENTS ---
    const form = document.getElementById('warrantyForm');
    const emailInput = document.getElementById('email');
    const productNameSelect = document.getElementById('productName');
    const productIdInput = document.getElementById('productid');
    const installationDateInput = document.getElementById('installationDate');
    const nextServiceDateInput = document.getElementById('nextServiceDate');
    
    const successOverlay = document.getElementById('successOverlay');
    const btnBackHome = document.getElementById('btnBackHome');

    // --- PRODUCT MAPPING ---
    productNameSelect.addEventListener('change', (e) => {
        productIdInput.value = e.target.value;
    });

    // --- SUBMISSION & VALIDATION ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let hasError = false;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const parent = field.closest('.input-group');
            if (!field.value) {
                parent.classList.add('has-error');
                parent.querySelector('.error-text')?.style.setProperty('display', 'block');
                hasError = true;
            } else {
                parent.classList.remove('has-error');
                parent.querySelector('.error-text')?.style.setProperty('display', 'none');
            }
        });

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value && !emailRegex.test(emailInput.value)) {
            emailInput.closest('.input-group').classList.add('has-error');
            emailInput.closest('.input-group').querySelector('.error-text').style.setProperty('display', 'block');
            hasError = true;
        }

        if (hasError) {
            showToast('Please fill all required fields correctly');
            return;
        }

        // Show Success Overlay
        document.getElementById('res-email').textContent = emailInput.value;
        document.getElementById('res-product').textContent = productNameSelect.options[productNameSelect.selectedIndex].text;
        document.getElementById('res-id').textContent = productIdInput.value;
        document.getElementById('res-date').textContent = new Date(installationDateInput.value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        document.getElementById('res-next').textContent = new Date(nextServiceDateInput.value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

        successOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    btnBackHome.addEventListener('click', () => {
        successOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        form.reset();
        location.reload();
    });

    document.getElementById('nav-toggle').addEventListener('click', () => {
        showToast('Menu Toggled');
    });

});