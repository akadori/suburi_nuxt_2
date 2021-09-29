const base64url = require("base64url")
const rs = require("jsrsasign")
const crypto = require("crypto");

const headerOrigin = "eyJ0eXAiOiJKV1QiLCJraWQiOiJkZjhlMjRjOC0xODk0LTRmODgtYjBhNS0yMDc4ODIzMDU4YzciLCJhbGciOiJFUzI1NiIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsImNsaWVudCI6IjI4MzU4Nzk4Mzg0Ni1qZ2Zic2QwMGw1amp0NDdsdWEwYXZubXBmcGxubmM3bC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInNpZ25lciI6ImFybjphd3M6ZWxhc3RpY2xvYWRiYWxhbmNpbmc6YXAtbm9ydGhlYXN0LTE6NDEzODE1NTgwNjYxOmxvYWRiYWxhbmNlci9hcHAvZW5kcG9pbnQtdGFtYXJpdGFtYXJpLWNsaWNrL2NjYmQ1ZjhhNGEzZWJiNGYiLCJleHAiOjE2MzI4MzkyOTh9"
const header = base64url.encode(
  JSON.stringify(
    {
      "typ": "JWT",
      "kid": "df8e24c8-1894-4f88-b0a5-2078823058c7",
      "alg": "ES256",
      "iss": "https://accounts.google.com",
      "client": "283587983846-jgfbsd00l5jjt47lua0avnmpfplnnc7l.apps.googleusercontent.com",
      "signer": "arn:aws:elasticloadbalancing:ap-northeast-1:413815580661:loadbalancer/app/endpoint-tamaritamari-click/ccbd5f8a4a3ebb4f",
      "exp": 1632839298
    }
  )
)
console.log('header === headerOrigin :>> ', header === headerOrigin);

const payloadOrigin = "eyJzdWIiOiIxMTU3MzQyNjk0NzE2ODY1NzQ1NzgiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2lDMGJLUUJ0aHM4TEFkZzZhZ2F2MGxhVzdMS05TSVp0RnAteC1FVWZZPXM5Ni1jIiwiZXhwIjoxNjMyODM5Mjk4LCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20ifQ=="
const payload = base64url.toBase64(
  base64url.encode(
    JSON.stringify(
      {
        "sub": "115734269471686574578",
        "picture": "https://lh3.googleusercontent.com/a-/AOh14GiC0bKQBths8LAdg6agav0laW7LKNSIZtFp-x-EUfY=s96-c",
        "exp": 1632839298,
        "iss": "https://accounts.google.com"
      }
    )
  )
)
console.log('payload === payloadOrigin :>> ', payload === payloadOrigin);

const sign = rs.KJUR.jws.JWS.sign(null, { alg: "ES256" }, `${header}.${payload}`,
`-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgevZzL1gdAFr88hb2
OF/2NxApJCzGCEDdfSp6VQO30hyhRANCAAQRWz+jn65BtOMvdyHKcvjBeBSDZH2r
1RTwjmYSi9R/zpBnuQ4EiMnCqfMPWiZqB4QdbAd0E7oH50VpuZ1P087G
-----END PRIVATE KEY-----`)
console.log('sign :>> ', sign);

const signer = crypto.createSign("SHA256"); // ハッシュ関数を指定
signer.update(`${header}.${payload}`);
signer.end();
const signature = signer.sign(
`-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgevZzL1gdAFr88hb2
OF/2NxApJCzGCEDdfSp6VQO30hyhRANCAAQRWz+jn65BtOMvdyHKcvjBeBSDZH2r
1RTwjmYSi9R/zpBnuQ4EiMnCqfMPWiZqB4QdbAd0E7oH50VpuZ1P087G
-----END PRIVATE KEY-----`
  , "base64");

console.info(`asn1 base64 encoded signature: ${signature}\n`);
