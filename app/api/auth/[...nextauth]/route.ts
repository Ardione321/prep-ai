import dbConnect from "@/backend/config/dbConnect";
import User from "@/backend/models/user.model";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials?.email }).select(
          "+password"
        );

        if (!user) {
          throw new Error("Invalid Email or Password");
        }

        const isPasswordMatched = await user.comparePassword(
          credentials?.password
        );

        if (!isPasswordMatched) {
          throw new Error("Invalid Email or Password");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      await dbConnect();

      if (account?.provider === "credentials") {
        user.id = user?._id;
      } else {
        // Handle social login
        const existingUser = await User.findOne({ email: user?.email });

        if (!existingUser) {
          const newUser = new User({
            email: user?.email,
            name: user?.name,
            profilePicture: {
              url: profile?.image || user?.image,
            },
            authProvider: [
              {
                provider: account?.provider,
                providerId: account?.id || profile?.id,
              },
            ],
          });

          await newUser.save();
          user.id = newUser._id;
        } else {
          user.id = existingUser._id;
        }
      }

      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;

      delete session.user.password;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const GET = NextAuth(options);
export const POST = NextAuth(options);
