import NextAuth from "next-auth";
import "next-auth/jwt";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@repo/db";

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.userId) {
        session.user.id = token.userId;

        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
        if (token.picture || token.image) {
          session.user.image = (token.picture || token.image) as string;
        }
      }
      return session;
    },
  },
});