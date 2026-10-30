/**
 * One-time administrator provisioning script to grant Firebase Auth custom claim { admin: true }.
 * Usage: node scripts/setAdmin.js <admin-email>
 * Never commit service-account credentials to the repository.
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emailArg = process.argv[2];

if (!emailArg) {
  console.log('Usage: node scripts/setAdmin.js <admin-email>');
  console.log('Example: node scripts/setAdmin.js admin@quesolutions.com');
  process.exit(1);
}

const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: serviceAccountKey.json not found in project root.');
  console.log('Please download your private key JSON from Firebase Console > Project Settings > Service Accounts,');
  console.log('place it at serviceAccountKey.json (which is git-ignored), and re-run this script.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

async function setAdminClaim(email) {
  try {
    const user = await getAuth().getUserByEmail(email);
    await getAuth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✓ Success! Custom claim { admin: true } granted to user:`);
    console.log(`  UID: ${user.uid}`);
    console.log(`  Email: ${user.email}`);
    console.log('\nThe user will have full administrative access to /que and Firestore write operations.');
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.error(`Error: User with email "${email}" was not found in Firebase Authentication.`);
      console.log('Please register or create this user in Firebase Console > Authentication > Users first, then re-run.');
    } else {
      console.error('Error granting claim:', err.message);
    }
    process.exit(1);
  }
}

setAdminClaim(emailArg);
