import bcrypt from "bcrypt";

export const verificationCode = async (name: string) => {
  const hashString = await bcrypt.hash(name, 10);
  return hashString;
};
