import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "process";

export default async function auth(req: NextApiRequest, res: NextApiResponse<any>) {
  // eslint-disable-next-line
  return await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        credentials: {
          user: {},
        },
        // @ts-ignore
        async authorize({ user = null }) {
          // If no error and we have user data, return it
          if (user) {
            return JSON.parse(user);
          }
          // Return null if user data could not be retrieved
          return null;
        },
      }),
    ],

    pages: {
      signIn: "/user/login", // Displays signin buttons
      // signOut: '/auth/signout', // Displays form with sign out button
      error: "/user/login", // Error code passed in query string as ?error=
      // verifyRequest: '/auth/verify-request', // Used for check email page
      // newUser: null // If set, new users will be directed here on first sign in
    },

    // secret: env.JWT_SECRET,

    secret: env.JWT_SECRET,

    callbacks: {
      // @ts-ignore
      async signIn(params) {
        return params.user;
      },

      async jwt(token: any) {
        if (req.query["update"]) {
          let parsedData;
          const data = req.query["editedData"];
          const favorites = req.query["favorites"];
          // @ts-ignore
          if (data && typeof data === "string") {
            parsedData = JSON.parse(data);
          }
          // @ts-ignore
          if (parsedData?.firstName) {
            // @ts-ignore
            token.token.user.user = { ...token.token.user.user, firstName: parsedData.firstName };
          }

          // @ts-ignore
          if (parsedData?.changeFirstTimeLogin) {
            // @ts-ignore
            token.token.user.user = { ...token.token.user.user, firstTimeLogin: false };
          }

          // @ts-ignore

          if (parsedData?.lastName) {
            // @ts-ignore
            token.token.user.user = { ...token.token.user.user, lastName: parsedData.lastName };
          }

          if (parsedData?.avatar) {
            // @ts-ignore
            token.token.user.user = { ...token.token.user.user, avatar: parsedData?.avatar };
          }

          if (parsedData?.title) {
            // @ts-ignore
            token.token.user.user = { ...token.token.user.user, title: parsedData.title };
          }

          if (favorites) {
            // @ts-ignore
            token.token.user.user = {
              // @ts-ignore
              ...token.token.user.user,
              favorites: favorites,
            };
          }
        }

        return {
          user: token.token.user ?? {
            jwt: token.user.jwt,
            user: {
              id: token.user.user?.id,
              email: token.user.user?.email,
              title: token.user.user?.title,
              slug: token.user && token.user.user?.slug,
              firstName: token.user && token?.user?.user.firstName,
              lastName: token.user && token?.user?.user.lastName,
              firstTimeLogin: token.user && token?.user?.user.firstTimeLogin,
              favorites: token.user && JSON.stringify(token.user.user.favorites.map((f: { id: any }) => f.id)),
              role: {
                type: token?.user && token?.user?.user?.role?.type,
              },
              avatar: token.user && token?.user?.user.avatar,
            },
          },
        };
      },

      async signOut() {
        // axios.post()
      },

      // @ts-ignore
      async session({ token, session }) {
        return { expires: session.expires, user: token.user };
      },
    },
  });
}
