import GoogleProvider from "next-auth/providers/google";

const allowedGoogleIds = process.env.ALLOWED_GOOGLE_IDS?.split(",").map((id) =>
  id.trim()
);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.sub) {
        const googleId = profile.sub;
        const isAllowed = allowedGoogleIds.includes(googleId);

        if (!isAllowed) {
          console.warn(`[Auth] Nieautoryzowana próba logowania: ${googleId}`);
          return false;
        }

        console.log(`[Auth] Użytkownik autoryzowany: ${googleId}`);
        return true;
      }

      return true;
    },

    async jwt({ token, profile, account }) {
      if (account?.provider === "google" && profile) {
        token.googleId = profile.sub;
        token.email = profile.email;
        token.provider = account.provider;
        token.isAllowed = allowedGoogleIds.includes(profile.sub);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.googleId = token.googleId;
        session.user.email = token.email;
        session.user.provider = token.provider;
        session.user.isAllowed = token.isAllowed;
      }

      return session;
    },
  },
};
