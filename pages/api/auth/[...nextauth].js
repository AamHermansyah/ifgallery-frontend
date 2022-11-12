import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google';
import { client } from '../../../client';

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, account }) {
          if (account) {
            token.userId = user.id;
          }
          return token;
        },
        async session({ session, token }) {
          session.user.userId = token.userId;
          const { user  } = session;
          const doc = {
            _id: user.userId,
            _type: 'user',
            username: user.name,
            image_url: user.image,
            role_user: 'user'
          }
      
          try {
            const res  = await client.createIfNotExists(doc);
            session.user.role = res.role_user;
            session.user.image = res.image_url
          } catch (error) {
            session.error = "Terjadi error di server." 
          }

          return session;
        },
      },
      url: process.env.NEXTAUTH_URL
})