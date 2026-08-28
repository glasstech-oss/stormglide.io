// One-off cleanup: resolves the SUBSCRIPTION_RENEWAL / BUDGET alert records
// created by the pre-fix title-based dedup bug (see functions/index.js,
// createAlertIfNew). Those rows have no `dedupeKey` field, so after the fix
// deploys they'd sit unresolved forever — nothing would ever match and
// update them again. Safe to run once after deploying the fix; re-running
// it later is a no-op once there's nothing left to clean up.
//
// Usage (from the functions/ directory, with GOOGLE_APPLICATION_CREDENTIALS
// or the repo's serviceAccountKey.json available):
//   node scripts/resolve-stale-alerts.js

const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '..', '..', 'serviceAccountKey.json'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function main() {
  const snap = await db.collection('alertRecords').where('resolved', '==', false).get();
  const toResolve = snap.docs.filter((d) => ['SUBSCRIPTION_RENEWAL', 'BUDGET'].includes(d.data().type) && !d.data().dedupeKey);

  if (toResolve.length === 0) {
    console.log('Nothing to clean up.');
    process.exit(0);
  }

  console.log(`Resolving ${toResolve.length} pre-fix duplicate alert(s):`);
  toResolve.forEach((d) => console.log(' -', d.data().title));

  const batch = db.batch();
  toResolve.forEach((d) => {
    batch.update(d.ref, {
      resolved: true,
      resolvedAt: admin.firestore.Timestamp.now(),
      resolvedBy: 'system-cleanup (dedupe bug fix)',
      updatedAt: admin.firestore.Timestamp.now(),
    });
  });
  await batch.commit();
  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
