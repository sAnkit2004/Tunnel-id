import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;

export function encrypt(text: string, masterKey: Buffer): string {
  const iv = randomBytes(IV_LENGTH);
  const salt = randomBytes(SALT_LENGTH);
  const cipher = createCipheriv(ALGORITHM, masterKey, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  // Combine all components
  const result = Buffer.concat([salt, iv, tag, encrypted]);
  return result.toString('base64');
}

export function decrypt(encryptedData: string, masterKey: Buffer): string {
  const data = Buffer.from(encryptedData, 'base64');

  // Extract components
  const salt = data.slice(0, SALT_LENGTH);
  const iv = data.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = data.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = data.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, masterKey, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}

