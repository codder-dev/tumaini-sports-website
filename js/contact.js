
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

    const successMsg = document.getElementById('successMsg');


    // =========================
    // SHOW ERROR MESSAGE
    // =========================
    function showError(elementId, message) {
        const el = document.getElementById(elementId);

        if (el) {
            el.textContent = message;
        }
    }


    // =========================
    // FIELD VALIDATION STATE
    // =========================
    function setFieldState(field, valid) {

        if (!field) return;

        field.classList.toggle('error', !valid);
        field.classList.toggle('success', valid);
    }


    // =========================
    // VALIDATE NAME
    // =========================
    function validateName() {

        const value = fields.name.value.trim();

        const valid = value.length >= 2;

        showError(
            'nameError',
            valid
                ? ''
                : (value
                    ? 'Name must be at least two characters'
                    : 'Name is required')
        );

        setFieldState(fields.name, valid);

        return valid;
    }


    // =========================
    // VALIDATE EMAIL
    // =========================
    function validateEmail() {

        const value = fields.email.value.trim();

        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        showError(
            'emailError',
            valid
                ? ''
                : (value
                    ? 'Please enter a valid email'
                    : 'Email is required')
        );

        setFieldState(fields.email, valid);

        return valid;
    }


    // =========================
    // VALIDATE PHONE
      // =========================
    function validatePhone() {

        const value = fields.phone.value.trim();

        
        // it must be a valid phone number
        const valid = /^[+]?[0-9\s().-]{7,20}$/.test(value);

        showError('phoneError', valid ? '' : (valid ? 'Please enter a valid phone number' : 'Please enter your phone number' )  );

        setFieldState(fields.phone, valid);

        return valid;
    }


    // =========================
    // VALIDATE SUBJECT
    // =========================
    function validateSubject() {

        const value = fields.subject.value.trim();

        const valid = value.length > 0;

        showError(
            'subjectError',
            valid
                ? ''
                : 'Subject is required'
        );

        setFieldState(fields.subject, valid);

        return valid;
    }


    // =========================
    // VALIDATE MESSAGE
    // =========================
    function validateMessage() {

        const value = fields.message.value.trim();

        const valid = value.length >= 10;

        showError(
            'messageError',
            valid
                ? ''
                : (value
                    ? 'Message must be at least 10 characters'
                    : 'Please type your message')
        );

        setFieldState(fields.message, valid);

        return valid;
    }


    // =========================
    // CLEAR ALL ERRORS
    // =========================
    function clearAllErrors() {

        document
            .querySelectorAll('.error-message')
            .forEach(el => {
                el.textContent = '';
            });

        document
            .querySelectorAll('input, textarea')
            .forEach(input => {
                input.classList.remove('error', 'success');
            });
    }


    // =========================
    // SHOW SUCCESS MESSAGE
    // =========================
    function showStatus(message) {

        if (!successMsg) return;

        successMsg.classList.remove('error');

        successMsg.innerHTML = message;

        successMsg.classList.add('show');

        successMsg.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Hide after 5 seconds
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 6000);
    }


    // =========================
    // FORM SUBMISSION
    // =========================
    form.addEventListener('submit', function (event) {

        // Prevent the browser from actually submitting
        event.preventDefault();

        // Clear previous errors
        clearAllErrors();


        // Validate everything
        const nameValid = validateName();
        const emailValid = validateEmail();
        const phoneValid = validatePhone();
        const subjectValid = validateSubject();
        const messageValid = validateMessage();


        const valid =
            nameValid &&
            emailValid &&
            phoneValid &&
            subjectValid &&
            messageValid;


        // =========================
        // INVALID FORM
        // =========================
        if (!valid) {

            const firstInvalid = form.querySelector('.error');

            if (firstInvalid) {

                firstInvalid.focus();

                firstInvalid.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }

            return;
        }


        // =========================
        // VALID FORM
        // =========================

        showStatus(
            'Message sent successfully! Thank you for contacting us. For faster reply, reach us via our <a href="mailto: tumainisportsinitiative@gmail.com" style="color: #e74c3c;">email</a> or <a href="tel: +254 726 318 700" style="color: #e74c3c;">phone Number</a>'
        );


        // Clear the form
        form.reset();


        // Remove success styling
        document
            .querySelectorAll('input, textarea')
            .forEach(field => {
                field.classList.remove('success');
            });


        console.log('Message sent successfully.');
    });


    // =========================
    // VALIDATE ON BLUR
    // =========================
    fields.name.addEventListener('blur', validateName);
    fields.email.addEventListener('blur', validateEmail);
    fields.phone.addEventListener('blur', validatePhone);
    fields.subject.addEventListener('blur', validateSubject);
    fields.message.addEventListener('blur', validateMessage);


    // =========================
    // VALIDATE WHILE TYPING
    // =========================
    fields.name.addEventListener('input', validateName);
    fields.email.addEventListener('input', validateEmail);
    fields.phone.addEventListener('input', validatePhone);
    fields.subject.addEventListener('input', validateSubject);
    fields.message.addEventListener('input', validateMessage);

});
