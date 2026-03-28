/**
 * /src/routes/api/update-feedback/+server.js
 *
 * POST /api/update-feedback
 *
 * Updates an existing uninstall record with the user's feedback reason.
 * Matches records by email address.
 *
 * Request body:
 *   {
 *     email:       string   — user email (used to find record)
 *     reason:      string   — selected reason id
 *     reasonLabel: string   — human-readable reason label
 *     otherText:   string   — free-text (only when reason === 'other')
 *     timestamp:   string   — ISO 8601 datetime
 *   }
 *
 * Response (200):
 *   { success: true, message: "Feedback recorded." }
 *
 * Response (400):
 *   { success: false, message: "Email and reason are required." }
 *
 * ─── Google Sheets Integration ────────────────────────────────────────────────
 * To update a row in Google Sheets by email:
 *
 *   // 1. Find row with matching email
 *   const getRes = await sheets.spreadsheets.values.get({
 *     spreadsheetId: process.env.SHEET_ID,
 *     range: 'Uninstalls!A:A',
 *   });
 *   const rows = getRes.data.values ?? [];
 *   const rowIndex = rows.findIndex(([e]) => e === sanitizedEmail);
 *
 *   if (rowIndex === -1) {
 *     // Email not found — insert a new row instead
 *     await sheets.spreadsheets.values.append({ ... });
 *   } else {
 *     // Update columns E–H on the matched row
 *     await sheets.spreadsheets.values.update({
 *       spreadsheetId: process.env.SHEET_ID,
 *       range: `Uninstalls!E${rowIndex + 1}:H${rowIndex + 1}`,
 *       valueInputOption: 'USER_ENTERED',
 *       requestBody: {
 *         values: [[reason, reasonLabel, otherText, 'complete']],
 *       },
 *     });
 *   }
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

  const {
    email,
    reason,
    reasonLabel = '',
    otherText = '',
    timestamp,
  } = body ?? {};

  // ── Validate ────────────────────────────────────────────────────────────────
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return json(
      { success: false, message: 'A valid email address is required.' },
      { status: 400 }
    );
  }

  if (!reason || typeof reason !== 'string') {
    return json(
      { success: false, message: 'A feedback reason is required.' },
      { status: 400 }
    );
  }

  const sanitizedEmail     = email.trim().toLowerCase();
  const sanitizedReason    = reason.trim();
  const sanitizedOtherText = typeof otherText === 'string' ? otherText.trim().slice(0, 500) : '';
  const eventTimestamp     = timestamp ?? new Date().toISOString();

  // ── Persist ─────────────────────────────────────────────────────────────────
  try {
    await updateRecord({
      email:       sanitizedEmail,
      reason:      sanitizedReason,
      reasonLabel: reasonLabel.trim(),
      otherText:   sanitizedOtherText,
      timestamp:   eventTimestamp,
      status:      'complete',
    });

    return json(
      {
        success: true,
        message: 'Feedback recorded. Thank you.',
        data: {
          email:  sanitizedEmail,
          reason: sanitizedReason,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[api/update-feedback] Storage error:', err);

    return json(
      { success: false, message: 'Failed to save feedback. Please try again.' },
      { status: 500 }
    );
  }
}

// ─── Storage Stub ─────────────────────────────────────────────────────────────
/**
 * updateRecord — replace with your actual persistence layer.
 *
 * Should find an existing record by email and update it,
 * or insert a new record if none exists (upsert).
 *
 * @param {{
 *   email:       string,
 *   reason:      string,
 *   reasonLabel: string,
 *   otherText:   string,
 *   timestamp:   string,
 *   status:      string,
 * }} record
 */
async function updateRecord(record) {
  // DEV: Log to console — replace with real integration
  console.log('[update-feedback] Feedback received:', record);

  // Simulate async I/O
  await new Promise((resolve) => setTimeout(resolve, 40));
}
