import translate from "../locale";
import bcrypt from "bcrypt";
import { UserSchema, UserForClient } from "../types";
export * from "ramda";

export const hashPassword = (password: string): string => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const checkHashPassword = (
  plaintextPassword: string,
  hash: string
): boolean => bcrypt.compareSync(plaintextPassword, hash);

export const isValidMobileNumber = (mobile: string): boolean => {
  return /^(0|0098|\+98)9(0[1-5]|[1 3]\d|2[0-2]|98)\d{7}$/.test(mobile);
};

export const { l, _l } = translate;

export const getUserDataForClient = ({
  mobile,
  fullname,
}: UserSchema): UserForClient => ({
  mobile,
  fullname,
});

export const mergeObjectToClass = (
  object: any | unknown,
  cls: any | unknown
): any => {
  for (const item in object) {
    cls[item] = object[item];
  }
  return cls;
};
