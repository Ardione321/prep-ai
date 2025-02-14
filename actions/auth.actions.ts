"use server";

/**
 * Import authentication-related controllers from the backend.
 */
import {
  register,
  updateUserPassword,
  updateUserProfile,
} from "@/backend/controller/auth.controller";

/**
 * Registers a new user with the provided name, email, and password.
 *
 * @param name - The full name of the user.
 * @param email - The email address of the user.
 * @param password - The password chosen by the user.
 * @returns The result of the registration process.
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const result = await register(name, email, password);
  return result;
}

/**
 * Updates the user profile with new details such as name, email, and avatar.
 *
 * @param name - The updated full name of the user.
 * @param email - The updated email address.
 * @param avatar - (Optional) The new avatar URL.
 * @param oldAvatar - (Optional) The previous avatar URL, if applicable.
 * @returns The result of the profile update process.
 */
export async function updateProfile({
  name,
  email,
  avatar,
  oldAvatar,
}: {
  name: string;
  email: string;
  avatar?: string;
  oldAvatar?: string;
}) {
  const result = await updateUserProfile({
    name,
    userEmail: email,
    avatar,
    oldAvatar,
  });

  return result;
}

/**
 * Updates the user password, ensuring that the new password and confirmation match.
 *
 * @param newPassword - The new password set by the user.
 * @param confirmPassword - The confirmation of the new password.
 * @param userEmail - The email address associated with the account.
 * @returns The result of the password update process.
 */
export async function updatePassword({
  newPassword,
  confirmPassword,
  userEmail,
}: {
  newPassword: string;
  confirmPassword: string;
  userEmail: string;
}) {
  const result = await updateUserPassword({
    newPassword,
    confirmPassword,
    userEmail,
  });

  return result;
}
