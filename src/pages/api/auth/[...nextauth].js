import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import nookies from 'nookies';

async function getUser(value, filterBy) {
  const url = `${process.env.VIDASHY_URL}${process.env.VIDASHY_ORGANIZATION}/${process.env.VIDASHY_DATABASE}/users?filterBy=${filterBy}&filterValue=${value}`;
  try {
    const response = await axios({
      method: 'get',
      url: url,
      headers: {
        Authorization: `Bearer ${process.env.VIDASHY_API_KEY}`,
      },
    });

    const user =
      (response.data &&
        response.data.records &&
        response.data.records.length > 0 &&
        response.data.records[0]) ||
      null;
    return user;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function fetchUser(username) {
  //DETERMINE IF USERNAME IS AN EMAIL WITH REGEX
  const isEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.)[a-zA-Z0-9_-]+$/;
  const filterBy = isEmail.test(username) ? 'Email' : 'Username';

  const user = await getUser(username, filterBy);
  if (!user) {
    throw new Error('User not found');
  }
  // You can now use the user object
  return user;
}

export default async function auth(req, res) {
  //TODO IMPLEMENT REMEMBER ME
  const maxAge = req.body.remember ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
  if (req.body.remember === true) {
    nookies.set({ res }, 'rememberSession', true, {
      maxAge: 5 * 24 * 60 * 60,
      path: '/',
    });
  } else if (req.body.remember === false) {
    nookies.set({ res }, 'rememberSession', false, {
      maxAge: 5 * 24 * 60 * 60,
      path: '/',
    });
  }

  return await NextAuth(req, res, {
    session: {
      strategy: 'jwt',
      maxAge: 1 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async jwt({ token, user }) {
        if (user?.id) token.id = user.id;
        if (user?.role) token.role = user.role;
        if (user?.name) token.name = user.name;
        if (user?.username) token.username = user.username;
        //if (user?.username) token.maxAge = maxAge;
        return token;
      },
      async session({ session, token }) {
        if (token?.id) session.user.id = token.id;
        if (token?.role) session.user.role = token.role;
        if (token?.name) session.name = token.name;
        if (token?.username) session.username = token.username;
        //if (token?.username) session.maxAge = maxAge;
        return session;
      },
    },
    providers: [
      CredentialsProvider({
        async authorize(credentials) {
          const user = await fetchUser(credentials.username);
          if (
            user &&
            bcryptjs.compareSync(credentials.password, user.Password)
          ) {
            return {
              id: user._uid,
              name: user.Name,
              username: user.Username,
              email: user.Email,
              role: user.Role,
            };
          }
          throw new Error('Invalid email or password');
        },
      }),
    ],
  });
}

// export default NextAuth({
//   session: {
//     strategy: 'jwt',
//     maxAge: 1 * 24 * 60 * 60,
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user?.id) token.id = user.id;
//       if (user?.role) token.role = user.role;
//       if (user?.name) token.name = user.name;
//       if (user?.username) token.username = user.username;
//       return token;
//     },
//     async session({ session, token }) {
//       if (token?.id) session.user.id = token.id;
//       if (token?.role) session.user.role = token.role;
//       if (token?.name) session.name = token.name;
//       if (token?.username) session.username = token.username;
//       return session;
//     },
//   },
//   providers: [
//     CredentialsProvider({
//       async authorize(credentials) {
//         const maxAges = {
//           _30Days: 10 * 24 * 60 * 60,
//           _1Day: 24 * 60 * 60,
//         };
//         const maxAge = credentials.remember ? maxAges._30Days : maxAges._1Day;
//         const user = await fetchUser(credentials.username);
//         if (user && bcryptjs.compareSync(credentials.password, user.password)) {
//           return {
//             id: user.id,
//             name: user.name,
//             username: user.username,
//             email: user.email,
//             role: user.role,
//             maxAge,
//           };
//         }
//         throw new Error('Invalid email or password');
//       },
//     }),
//   ],
// });
