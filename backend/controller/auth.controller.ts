import dbConnect from "../config/dbConnect";
import User from "../models/user.model";

/**
 * Registers a new user in the database.
 *
 * @param name The name of the user.
 * @param email The email of the user.
 * @param password The password of the user.
 * @returns An object with the property `created` set to `true` if the user is created,
 *          otherwise an error is thrown.
 */
export const register = async (
  name: string,
  email: string,
  password: string
): Promise<{ created: boolean }> => {
  await dbConnect();

  const newUser = await User.create({
    name,
    email,
    password,
    authProviders: [
      {
        provider: "credentials",
        providerId: email,
      },
    ],
  });

  return newUser?._id
    ? { created: true }
    : (() => {
        throw new Error("User not created");
      })();
};
