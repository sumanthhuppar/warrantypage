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
        toast.textContent = msg + ' (Coming Soon)';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };
    window.showToast = showToast;

    const hapticFeedback = (pattern = 50) => {
        if ('vibrate' in navigator) navigator.vibrate(pattern);
    };

    // --- FORM ELEMENTS ---
    const form = document.getElementById('warrantyForm');
    const otpMobile = document.getElementById('otpMobile');
    const btnSendOtp = document.getElementById('btnSendOtp');
    const otpSection = document.getElementById('verify-otp-section');
    const otpBoxes = document.querySelectorAll('.otp-box');
    const timerSpan = document.getElementById('timer');
    const btnResend = document.getElementById('btnResend');
    const sameMobile = document.getElementById('sameMobile');
    const regMobile = document.getElementById('regMobile');
    const purchaseDate = document.getElementById('purchaseDate');
    const serialInput = document.getElementById('serialNumber');
    const scanBtn = document.getElementById('scanBtn');
    
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const filePreview = document.getElementById('filePreview');
    const previewName = document.getElementById('previewName');
    const removeFile = document.getElementById('removeFile');
    
    const successOverlay = document.getElementById('successOverlay');
    const btnBackHome = document.getElementById('btnBackHome');

    // --- DATE CONFIG ---
    const today = new Date().toISOString().split('T')[0];
    purchaseDate.max = today;

    // --- OTP LOGIC ---
    let timerInterval;
    let isOtpVerified = false;

    const startTimer = () => {
        let timeLeft = 30;
        btnResend.style.pointerEvents = 'none';
        btnResend.style.opacity = '0.5';
        timerSpan.textContent = `Resend in ${timeLeft}s`;
        
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = `Resend in ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerSpan.textContent = '';
                btnResend.style.pointerEvents = 'auto';
                btnResend.style.opacity = '1';
            }
        }, 1000);
    };

    btnSendOtp.addEventListener('click', () => {
        if (otpMobile.value.length !== 10) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        btnSendOtp.disabled = true;
        btnSendOtp.innerHTML = 'Sending... <span class="spinner"></span>';
        
        // Simulate API call
        setTimeout(() => {
            btnSendOtp.innerHTML = 'Send OTP';
            btnSendOtp.disabled = false;
            document.getElementById('otp-sent-msg').style.display = 'block';
            otpSection.style.display = 'block';
            startTimer();
        }, 1500);
    });

    otpBoxes.forEach((box, index) => {
        box.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < otpBoxes.length - 1) {
                otpBoxes[index + 1].focus();
            }
            
            // Simulating correct OTP check (e.g. 123456)
            const enteredOtp = Array.from(otpBoxes).map(b => b.value).join('');
            if (enteredOtp.length === 6) {
                if (enteredOtp === '123456' || true) { // Simulating auto-verify for demo
                    document.getElementById('otp-success-msg').style.display = 'block';
                    isOtpVerified = true;
                    hapticFeedback([50, 30, 50]); // Success vibration
                    otpBoxes.forEach(b => b.style.borderColor = 'var(--success-green)');
                }
            }
        });

        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && index > 0) {
                otpBoxes[index - 1].focus();
            }
        });
    });

    // --- FORM LOGIC ---
    sameMobile.addEventListener('change', () => {
        if (sameMobile.checked) {
            regMobile.value = otpMobile.value;
            regMobile.readOnly = true;
        } else {
            regMobile.readOnly = false;
        }
    });

    serialInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });

    scanBtn.addEventListener('click', () => {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            alert('Opening camera for QR scan...');
        } else {
            alert('Camera unavailable. Use mobile for QR scanning.');
        }
    });

    // --- FILE UPLOAD ---
    const handleFile = (file) => {
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowed.includes(file.type)) {
            alert('Only JPG, PNG, and PDF files are allowed');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Max file size is 5MB');
            return;
        }

        progressBar.style.display = 'block';
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressFill.style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressBar.style.display = 'none';
                    filePreview.style.display = 'flex';
                    previewName.textContent = file.name;
                    dropZone.style.display = 'none';
                }, 500);
            }
        }, 100);
    };

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handleFile(e.target.files[0]);
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-red)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--border-color)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });

    removeFile.addEventListener('click', () => {
        fileInput.value = '';
        filePreview.style.display = 'none';
        dropZone.style.display = 'block';
        progressFill.style.width = '0%';
    });

    // --- SUBMISSION & VALIDATION ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let hasError = false;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const parent = field.closest('.input-group') || field.parentElement;
            if (!field.value) {
                parent.classList.add('has-error');
                parent.querySelector('.error-text')?.style.setProperty('display', 'block');
                if (!hasError) {
                    hapticFeedback(100); // Error vibration
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    field.classList.add('shake');
                    setTimeout(() => field.classList.remove('shake'), 500);
                }
                hasError = true;
            } else {
                parent.classList.remove('has-error');
                parent.querySelector('.error-text')?.style.setProperty('display', 'none');
            }
        });

        // Email validation
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value && !emailRegex.test(email.value)) {
            email.closest('.input-group').classList.add('has-error');
            hasError = true;
        }

        if (!isOtpVerified) {
            alert('Please verify your mobile number with OTP before submitting');
            document.getElementById('mobile-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
            hasError = true;
        }

        if (hasError) return;

        // Show Success Overlay
        const regId = 'WR-' + Math.floor(Math.random() * 9000000000 + 1000000000);
        document.getElementById('res-id').textContent = regId;
        document.getElementById('res-product').textContent = document.getElementById('modelName').value;
        document.getElementById('res-serial').textContent = serialInput.value;
        document.getElementById('res-date').textContent = purchaseDate.value;
        document.getElementById('res-mobile').textContent = '+91 ' + regMobile.value;
        
        const validUntil = new Date(purchaseDate.value);
        validUntil.setFullYear(validUntil.getFullYear() + 2); // Assuming 2 years warranty
        document.getElementById('res-valid').textContent = validUntil.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

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
        showToast('Mobile Menu Toggle');
    });

});