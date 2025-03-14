import crypto from "crypto";

export const hashPassword = (password: string, salt: string) => {
  return new Promise<string>((resolve, reject) =>
    crypto.scrypt(password.normalize(), salt, 64, (err, derivedKey) => {
      if (err) {
        return reject(err);
      }

      resolve(derivedKey.toString("hex").normalize());
    })
  );
};

export const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex").normalize();
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
  salt: string
) => {
  const hashedInput = await hashPassword(password, salt);
  return crypto.timingSafeEqual(
    Buffer.from(hashedInput),
    Buffer.from(hashedPassword)
  );
};
