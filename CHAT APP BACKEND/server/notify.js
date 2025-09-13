// server/notify.js
const User = require('../models/User');
const admin = require('./fcm');
// const User = require('..User/models/User');

async function sendPushToUser(userId, { title, body, data = {} }) {
  const user = await User.findById(userId).lean();
  if (!user || !user.fcmTokens?.length) return { ok: false, reason: 'no-tokens' };

  const message = {
    tokens: user.fcmTokens,
    notification: { title, body },
    data, // strings only
    android: { priority: 'high' },
    webpush: { headers: { Urgency: 'high' } },
  };

  const resp = await admin.messaging().sendEachForMulticast(message);

  // Clean up invalid tokens
  const invalid = new Set();
  resp.responses.forEach((r, idx) => {
    if (!r.success) {
      const code = r.error?.code || '';
      if (
        code.includes('registration-token-not-registered') ||
        code.includes('invalid-argument')
      ) invalid.add(user.fcmTokens[idx]);
    }
  });
  if (invalid.size) {
    await User.updateOne(
      { _id: userId },
      { $pull: { fcmTokens: { $in: Array.from(invalid) } } }
    );
  }
  return { ok: true, sent: resp.successCount, failed: resp.failureCount };
}

module.exports = { sendPushToUser };
