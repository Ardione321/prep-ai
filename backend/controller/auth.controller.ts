import dbConnect from "../config/dbConnect";
import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import User from "../models/user.model";
import { delete_file, upload_file } from "../utils/cloudinary";
import { resetPasswordHTMLTemplate } from "../utils/emailTemplate";
import sendEmail from "../utils/sendEmail";

/**
 * Register a new user with credentials.
 * @param name - The name of the user.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @returns Promise indicating whether the user was created.
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

/**
 * Update user's profile information including avatar.
 * @param name - The name of the user.
 * @param userEmail - The email of the user.
 * @param avatar - New avatar image path.
 * @param oldAvatar - Old avatar image ID for deletion.
 * @returns Promise indicating whether the profile was updated.
 */
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

/**
 * Update user's password if matched confirmation.
 * @param newPassword - The new password to set.
 * @param confirmPassword - Confirmation of the new password.
 * @param userEmail - The email of the user.
 * @returns Promise indicating whether the password was updated.
 */
export const updateUserPassword = catchAsyncErrors(
  async ({
    newPassword,
    confirmPassword,
    userEmail,
  }: {
    newPassword: string;
    confirmPassword: string;
    userEmail: string;
  }): Promise<{ updated: boolean }> => {
    await dbConnect();

    const user = await User.findOne({
      email: userEmail,
    }).select("+password");

    if (newPassword !== confirmPassword) {
      throw new Error("Password do not match");
    }

    const isUsingCredentials = user?.authProviders?.some(
      (provider: { provider: string }) => provider.provider === "credentials"
    );

    if (!isUsingCredentials) {
      user?.authProviders?.push({
        provider: "credentials",
        providerId: userEmail,
      });
    }
    user.password = newPassword;
    await user.save();

    return { updated: true };
  }
);

/**
 * Sends a password reset request to the user. The generated
 * token is only valid for 30 minutes.
 * @param email - The email of the user to send the reset request to.
 * @returns Promise indicating whether the email was sent.
 */
export const forgotUserPassword = catchAsyncErrors(
  async (email: string): Promise<{ emailSent: boolean }> => {
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = user.getResetPasswordToken();
    await user.save;

    const resetUrl = `${process.env.NEXTAUTH_URL}/password/reset/${resetToken}`;
    const message = resetPasswordHTMLTemplate(user?.name, resetUrl);

    try {
      await sendEmail({
        email: user.email,
        subject: "Prep AI Password reset request",
        message,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      throw new Error("Email could not be sent");
    }
    return { emailSent: true };
  }
);
