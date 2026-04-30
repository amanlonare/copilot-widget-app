import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Simple placeholder auth for Phase 7
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Admin Access',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Placeholder: only allow admin/admin for now
        if (credentials?.username === "admin" && credentials?.password === "admin") {
          return { id: "1", name: "Admin", email: "admin@example.com" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    }
  }
});

export { handler as GET, handler as POST };
