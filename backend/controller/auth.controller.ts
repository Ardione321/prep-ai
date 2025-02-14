import dbConnect from "../config/dbConnect";
import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import User from "../models/user.model";
import { delete_file, upload_file } from "../utils/cloudinary";

/**
 * Registers a new user in the database.
 *
 * @param name The name of the user.
 * @param email The email of the user.
 * @param password The password of the user.
 * @returns An object with the property `created` set to `true` if the user is created,
 *          otherwise an error is thrown.
 */
export const register = catchAsyncErrors(
  async (
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
  }
);

export const updateUserProfile = catchAsyncErrors(
  async ({
    name,
    userEmail,
    avatar,
    oldAvatar,
  }: {
    name: string;
    userEmail: string;
    avatar: string;
    oldAvatar: string;
  }): Promise<{ updated: boolean }> => {
    await dbConnect();

    const data: {
      name: string;
      profilePicture?: { id: string; url: string };
    } = { name };

    if (avatar) {
      data.profilePicture = await upload_file(avatar, "prep-ai/avatars");

      if (oldAvatar) {
        await delete_file(oldAvatar);
      }
    }

    await User.findOneAndUpdate(
      {
        email: userEmail,
      },
      { ...data }
    );

    return { updated: true };
  }
);
