/**
 * /src/routes/api/save-email/+server.js
 *
 * POST /api/save-email
 *
 * Records an uninstall event for the given email address.
 *
 * Request body:
 *   {
 *     email:     string   — user email
 *     timestamp: string   — ISO 8601 datetime
 *     source:    string   — origin identifier (e.g. "uninstall_page")
 *   }
 *
 * Response (200):
 *   { success: true, message: "Uninstall event recorded." }
 *
 * Response (400):
 *   { success: false, message: "Email is required." }
 *
 * ─── Google Sheets Integration ────────────────────────────────────────────────
 * To connect to Google Sheets, replace the `saveToStore()` stub below with:
 *
 *   import { google } from 'googleapis';
 *
 *   const auth = new google.auth.GoogleAuth({
 *     credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
 *     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
 *   });
 *
 *   const sheets = google.sheets({ version: 'v4', auth });
 *
 *   await sheets.spreadsheets.values.append({
 *     spreadsheetId: process.env.SHEET_ID,
 *     range: 'Uninstalls!A:D',
 *     valueInputOption: 'USER_ENTERED',
 *     requestBody: {
 *       values: [[email, timestamp, source, 'pending']],
 *     },
 *   });
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  let body;

  // ── Parse request body ──────────────────────────────────────────────────────
  try {
    body = await request.json();
  } catch {
    return json(
      { success: false, message: 'Invalid JSON in request body.' },
      { status: 400 }
    );
  }

  const { email, timestamp, source = 'uninstall_page' } = body ?? {};

  // ── Validate ────────────────────────────────────────────────────────────────
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return json(
      { success: false, message: 'A valid email address is required.' },
      { status: 400 }
    );
  }

  const sanitizedEmail = email.trim().toLowerCase();
  const eventTimestamp = timestamp ?? new Date().toISOString();

  // ── Persist ─────────────────────────────────────────────────────────────────
  try {
    await saveToStore({
      email: sanitizedEmail,
      timestamp: eventTimestamp,
      source,
      feedbackStatus: 'pending',
    });

    return json(
      {
        success: true,
        message: 'Uninstall event recorded.',
        data: { email: sanitizedEmail, timestamp: eventTimestamp },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[api/save-email] Storage error:', err);

    return json(
      { success: false, message: 'Failed to record event. Please try again.' },
      { status: 500 }
    );
  }
}

// ─── Storage Stub ─────────────────────────────────────────────────────────────
/**
 * saveToStore — replace this with your actual persistence layer.
 *
 * Options:
 *   - Google Sheets  (see JSDoc above)
 *   - Supabase       await supabase.from('uninstalls').insert({ ... })
 *   - Prisma         await prisma.uninstall.create({ data: { ... } })
 *   - Airtable       await airtable('Uninstalls').create({ ... })
 *   - Plain file log (dev only)
 *
 * @param {{ email: string, timestamp: string, source: string, feedbackStatus: string }} record
 */
async function saveToStore(record) {
  // DEV: Log to console — replace with real integration
  console.log('[save-email] New uninstall event:', record);

  // Simulate async I/O
  await new Promise((resolve) => setTimeout(resolve, 30));
}
