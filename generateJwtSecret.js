const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function generateJwtSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

const jwtSecret = generateJwtSecret();

// Load existing .env file or create an empty object if file doesn't exist
const envFilePath = path.join(__dirname, 'disposition.env');
const envConfig = fs.existsSync(envFilePath) ? dotenv.parse(fs.readFileSync(envFilePath)) : {};

// Update or set JWT_SECRET
envConfig.JWT_SECRET = jwtSecret;

// Write the updated config back to .env file
const envConfigString = Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join('\n');
fs.writeFileSync(envFilePath, envConfigString);

console.log('JWT_SECRET has been generated and saved to .env file.');
