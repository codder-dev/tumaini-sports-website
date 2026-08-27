require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const SITE_ROOT = __dirname;

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many contact attempts. Please wait a few minutes and try again.' }
});

function clean(value, maxLength) {
    return String(value ?? '').trim().slice(0, maxLength);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return phone === '' || /^[+]?[0-9\s().-]{7,20}$/.test(phone);
}

function validateContact(body) {
    const name = clean(body.name, 100);
    const email = clean(body.email, 254);
    const phone = clean(body.phone, 30);
    const subject = clean(body.subject, 180);
    const message = clean(body.message, 5000);

    if (name.length < 2) return { error: 'Please enter your name.' };
    if (!isValidEmail(email)) return { error: 'Please enter a valid email address.' };
    if (!isValidPhone(phone)) return { error: 'Please enter a valid phone number.' };
    if (!subject) return { error: 'Please enter a subject.' };
    if (message.length < 10) return { error: 'Message must be at least 10 characters.' };

    return { data: { name, email, phone, subject, message } };
}

function getTransporter() {
    const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length) {
        throw new Error(`Missing email configuration: ${missing.join(', ')}`);
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

app.post('/api/contact', contactLimiter, async (req, res) => {
    const { data, error } = validateContact(req.body);

    if (error) {
        return res.status(400).json({ message: error });
    }

    const recipient = process.env.CONTACT_RECEIVER || 'tumainisportsinitiative@gmail.com';
    const fromAddress = process.env.MAIL_FROM || process.env.SMTP_USER;

    const html = `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone || 'Not provided')}</p>
        <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
    `;

    try {
        const transporter = getTransporter();

        await transporter.sendMail({
            from: fromAddress,
            to: recipient,
            replyTo: data.email,
            subject: `Website Contact: ${data.subject}`,
            text: [
                'New contact form submission',
                `Name: ${data.name}`,
                `Email: ${data.email}`,
                `Phone: ${data.phone || 'Not provided'}`,
                `Subject: ${data.subject}`,
                '',
                data.message
            ].join('\n'),
            html
        });

        return res.json({ message: 'Message sent Successfully' });
    } catch (err) {
        console.error('Email delivery failed:', err);
        return res.status(500).json({
            message: 'We could not send your message right now. Please try again later.'
        });
    }
});

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Static website
app.use(express.static(SITE_ROOT));

app.get(/^(?!\/api\/).*/, (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(SITE_ROOT, 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'An unexpected server error occurred.' });
});

app.listen(PORT, () => {
    console.log(`Tumaini Sports Initiative running at http://localhost:${PORT}`);
});
