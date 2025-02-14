"use server";

import {
  register,
  updateUserProfile,
} from "@/backend/controller/auth.controller";

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  return await register(name, email, password);
}

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
