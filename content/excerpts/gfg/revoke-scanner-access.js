import { queryDocuments, setDocument, logAudit } from '../utils/firestore.js';

/**
 * Auto-revoke scanner access after event date has passed
 * Runs daily via cron trigger
 *
 * Scanner access is stored as an array within the events document:
 * events/{eventId}.scanners = [{ userId, userName, grantedAt, grantedBy }]
 */
export async function revokeExpiredScannerAccess(env) {
  try {
    const now = new Date().toISOString();

    // Find all events that have passed.
    // event.date is stored as a plain ISO string (stringValue), not a
    // Firestore timestamp — createEventSchema validates it as a string and
    // it's written through unconverted. String comparison still works
    // correctly for ISO 8601 dates since lexicographic order matches
    // chronological order.
    const events = await queryDocuments(env, 'events', [
      { field: 'date', op: 'LESS_THAN', value: { stringValue: now } }
    ]);

    if (!events || events.length === 0) {
      console.log('No past events found');
      return { success: true, revokedCount: 0, processedEvents: 0 };
    }

    let revokedCount = 0;
    let processedEvents = 0;

    for (const event of events) {
      // Check if event has any scanners
      if (!event.scanners || event.scanners.length === 0) {
        continue;
      }

      // Clear the scanners array for this past event
      const scannerCount = event.scanners.length;

      await setDocument(env, 'events', event.id, {
        ...event,
        scanners: []
      });

      // Log audit trail for each revoked scanner
      for (const scanner of event.scanners) {
        await logAudit(env, 'auto_revoke_scanner_access', 'system', `${event.id}-${scanner.userId}`, {
          eventId: event.id,
          eventTitle: event.title,
          userId: scanner.userId,
          userName: scanner.userName,
          originallyGrantedAt: scanner.grantedAt,
          originallyGrantedBy: scanner.grantedBy
        });
      }

      revokedCount += scannerCount;
      processedEvents++;
    }

    console.log(`Auto-revoked ${revokedCount} scanner access grants from ${processedEvents} past events`);
    return { success: true, revokedCount, processedEvents };

  } catch (error) {
    console.error('Auto-revoke error:', error);
    throw error;
  }
}
