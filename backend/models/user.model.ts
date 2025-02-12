import { userRoles } from "@/constants/constants";
import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  profilePicture: {
    id: string;
    url: string | null;
  };
  password?: string | null;
  authProviders: {
    provider: string;
    providerId: string;
  }[];
  subscription: {
    id: string;
    customer: string;
    created: Date;
    status: string;
    startDate: Date;
    currentPeriodEnd: Date;
    nextPaymentAttempt: Date;
  };
}

const authProviderSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ["google", "github", "credentials"],
  },
  providerId: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
      unique: [true, "Email already exists"],
      lowercase: true,
    },
    roles: {
      type: [String],
      default: ["user"],
      enum: userRoles,
    },
    profilePicture: {
      id: String,
      url: {
        type: String,
        default: null,
      },
    },
    password: {
      type: String,
      select: false,
      minlength: [8, "Password must be at least 8 characters"],
      default: null,
    },
    authProviders: {
      type: [authProviderSchema],
      default: [],
    },
    subscription: {
      id: String,
      status: String,
      startDate: Date,
      currentPeriodEnd: Date,
      nextPaymentAttempt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    next();
  }

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
