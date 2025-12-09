// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth-config";

// const handler = NextAuth(authOptions);

// // export { handler as GET, handler as POST };


// // app/api/auth/[...nextauth]/route.ts
// // app/api/auth/[...nextauth]/route.ts

// export { handler as GET, handler as POST };

// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// --- NextAuth Options ---
export const authOptions: AuthOptions = {
  // Providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email",
          type: "text",
          placeholder: "your email",
          required: true,
        },
        password: { label: "Password", type: "password", required: true },
      },

      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.identifier },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  // Session config
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
  },

  // JWT callbacks
  callbacks: {
    async jwt({ token, user }) {
      // Store user id in token
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // Custom pages
  pages: {
    signIn: "/auth/login",
  },

  // Debug mode (only for development)
  debug: process.env.NODE_ENV === "development",
};

// Export NextAuth handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
