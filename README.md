# Tumaini Sports Initiative —  Website

This adds:
- A Node.js + Express server.
- A real contact-form API at `/api/contact`.
- Email delivery with Nodemailer.
- Server-side validation (in addition to browser validation).
- Rate limiting and security headers.
- Better contact-form states, loading feedback, errors, and mobile polish.

## Run locally

1. Install Node.js (LTS).
2. Open a terminal in this project folder.
3. Run:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env`.
5. Add SMTP credentials to `.env`.
6. Start:
   ```bash
   npm start
   ```
7. Open `http://localhost:3000`.

## Gmail setup

If the sending mailbox is Gmail/Google Workspace, use a Google App Password for `SMTP_PASS` rather than your normal Gmail password. The sending account must have 2-Step Verification enabled.

`CONTACT_RECEIVER` is already set to the existing email shown in the website content. Change it in `.env` if the owner wants a different receiving address.

## Important

Do not commit `.env` to GitHub or upload it publicly. It contains the SMTP password.

The visitor's email is placed in `Reply-To`, so when the owner clicks Reply on the notification email, the reply goes directly to the person who submitted the form.
