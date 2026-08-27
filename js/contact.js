document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };

    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('successMsg');

    function showError(elementId, message) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = message;
    }

    function setFieldState(field, valid) {
        if (!field) return;
        field.classList.toggle('error', !valid);
        field.classList.toggle('success', valid);
    }

    function validateName() {
        const value = fields.name.value.trim();
        const valid = value.length >= 2;
        showError('nameError', valid ? '' : (value ? 'Name must be at least two characters' : 'Name is required'));
        setFieldState(fields.name, valid);
        return valid;
    }

    function validateEmail() {
        const value = fields.email.value.trim();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        showError('emailError', valid ? '' : (value ? 'Please enter a valid email' : 'Email is required'));
        setFieldState(fields.email, valid);
        return valid;
    }

    function validatePhone() {
        const value = fields.phone.value.trim();
        // Phone is optional in the form. Validate it only when supplied.
        const valid = value === '' || /^[+]?[0-9\s().-]{7,20}$/.test(value);
        showError('phoneError', valid ? '' : 'Please enter a valid phone number');
        setFieldState(fields.phone, valid);
        return valid;
    }

    function validateSubject() {
        const value = fields.subject.value.trim();
        const valid = value.length > 0;
        showError('subjectError', valid ? '' : 'Please write your message');
        setFieldState(fields.subject, valid);
        return valid;
    }

    function validateMessage() {
        const value = fields.message.value.trim();
        const valid = value.length >= 10;
        showError('messageError', valid ? '' : (value ? 'Message must be at least 10 characters' : 'Please type your message'));
        setFieldState(fields.message, valid);
        return valid;
    }

    function clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('input, textarea').forEach(input => {
            input.classList.remove('error', 'success');
        });
    }

    function showStatus(message, type) {
        successMsg.classList.remove('show', 'error');
        successMsg.textContent = message;
        successMsg.classList.add('show');
        if (type === 'error') successMsg.classList.add('error');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        clearAllErrors();

        const valid =
            validateName() &&
            validateEmail() &&
            validatePhone() &&
            validateSubject() &&
            validateMessage();

        if (!valid) {
            const firstInvalid = form.querySelector('.error');
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        const originalButton = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        successMsg.classList.remove('show', 'error');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fields.name.value.trim(),
                    email: fields.email.value.trim(),
                    phone: fields.phone.value.trim(),
                    subject: fields.subject.value.trim(),
                    message: fields.message.value.trim()
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Unable to send your message.');
            }

            showStatus(result.message || 'Message sent Successfully', 'success');
            form.reset();
            document.querySelectorAll('input, textarea').forEach(field => field.classList.remove('success'));

            setTimeout(() => successMsg.classList.remove('show'), 5000);
        } catch (error) {
            console.error('Contact form error:', error);
            showStatus(error.message || 'Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalButton;
        }
    });

    fields.name.addEventListener('blur', validateName);
    fields.email.addEventListener('blur', validateEmail);
    fields.phone.addEventListener('blur', validatePhone);
    fields.subject.addEventListener('blur', validateSubject);
    fields.message.addEventListener('blur', validateMessage);

    fields.name.addEventListener('input', validateName);
    fields.email.addEventListener('input', validateEmail);
    fields.phone.addEventListener('input', validatePhone);
    fields.subject.addEventListener('input', validateSubject);
    fields.message.addEventListener('input', validateMessage);
});
