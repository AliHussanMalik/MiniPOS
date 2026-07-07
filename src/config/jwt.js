const crypto = require("crypto");
const env = require("./env");

const JWT_SECRET = env.jwtSecret;
const JWT_EXPIRES_IN_SECONDS = env.jwtExpiresInSeconds;

const base64UrlEncode = (value) => {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
};

const signPart = (value) => {
  return crypto.createHmac("sha256", JWT_SECRET).update(value).digest("base64url");
};

const signToken = (payload) => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const body = {
    ...payload,
    iat: now,
    exp: now + JWT_EXPIRES_IN_SECONDS,
  };

  const unsignedToken = `${base64UrlEncode(header)}.${base64UrlEncode(body)}`;
  const signature = signPart(unsignedToken);

  return `${unsignedToken}.${signature}`;
};

const verifyToken = (token) => {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid token");
  }

  const [header, payload, signature] = parts;
  const expectedSignature = signPart(`${header}.${payload}`);

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    throw new Error("Invalid token");
  }

  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return decoded;
};

module.exports = {
  signToken,
  verifyToken,
};
