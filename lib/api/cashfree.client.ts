import crypto from "crypto";

export function generateCashfreeSignature(): string {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const publicKey = process.env.CASHFREE_PUBLIC_KEY;

  // Current UNIX timestamp (seconds)
  const timestamp = Math.floor(Date.now() / 1000);

  // Data to encrypt: clientId.timestamp
  const payload = `${clientId}.${timestamp}`;

  // RSA encryption using public key
  const encryptedBuffer = crypto.publicEncrypt(
    {
      key: publicKey,
    },
    Buffer.from(payload, "utf8")
  );

  // Base64 encoded signature
  return encryptedBuffer.toString("base64");
}
