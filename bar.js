const crypto = require("crypto");

const msg = "Hello, ECDSA!";

const targetPublicKeyPEM = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAExW7riGWvlxmRofxQNuRhsF9anb+8
F/1NRGzZziCC/utzFMXSg9YwzaRb0Yw+K2n0+1IkWH7lQT9j4DZhF6Npfg==
-----END PUBLIC KEY-----`
const targetSignature = "MEUCICzZzFaPemBrWBLNlbbEG+CyXEdAbum9YnOe7lK0rNonAiEA8p1QN/1VcuWRvrPSDnELXedMfiP1FPtk/dmP3Sf/7gA="

main();

function main() {
  sign();
  verify();
}

function sign() {
  console.info("================================ start signing ================================\n")
  // P-256 をパラメータに指定してキーペアの生成
  const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", {
    namedCurve: "P-256",
  });

  // 秘密鍵を SEC 1, ASN.1 DER エンコード & PEM 形式で出力
  console.info(privateKey.export({
    type: "sec1",
    format: "pem",
  }));

  // 公開鍵を PKIX, ASN.1 DER エンコード & PEM 形式で出力
  console.info(publicKey.export({
    type: "spki",
    format: "pem",
  }));

  // 署名生成
  const signer = crypto.createSign("SHA256"); // ハッシュ関数を指定
  signer.update(msg);
  signer.end();
  const signature = signer.sign(privateKey, "base64");

  // 署名は ASN.1 エンコード され、 Base64 形式で出力されている
  console.info(`asn1 base64 encoded signature: ${signature}\n`);
}

function verify() {
  console.info("================================ start verification ================================\n")
  const publicKey = crypto.createPublicKey(targetPublicKeyPEM)

  // 署名検証
  const verifier = crypto.createVerify("SHA256"); // ハッシュ関数を指定
  verifier.update(msg);
  verifier.end();
  const valid = verifier.verify(publicKey, targetSignature, "base64");
  console.info(`signature was verified: ${valid}`);
}