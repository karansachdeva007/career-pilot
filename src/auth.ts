import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/db";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== NEXTAUTH LOGIN ATTEMPT ===");
        console.log("Received credentials:", credentials);
        
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          console.log("Parsed email:", email);
          const user = await prisma.user.findUnique({ 
            where: { email: email.toLowerCase() } 
          });
          
          if (!user) {
            console.log("User not found in database for email:", email.toLowerCase());
            return null;
          }
          
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log("Do passwords match?", passwordsMatch);
          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
        } else {
          console.log("Validation failed:", parsedCredentials.error);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("=== NEXTAUTH SESSION CALLBACK ===");
      console.log("Token:", token);
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("=== NEXTAUTH JWT CALLBACK ===");
      console.log("User:", user);
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
