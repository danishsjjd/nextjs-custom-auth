import crypto from "crypto";

export const passwordHash = (password: string, salt: string) => {
  return new Promise((resolve, reject) =>
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        return reject(err);
      }

      resolve(derivedKey.toString("hex"));
    })
  );
};

export const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex").normalize();
};
