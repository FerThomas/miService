import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { Taller } from '../types/taller'

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            },
            include: {
              taller: true
            }
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            plan: user.plan,
            taller: user.taller ? {
              id: user.taller.id,
              nombre: user.taller.nombre,
              contacto: user.taller.contacto,
              telefono: user.taller.telefono || undefined,
              direccion: user.taller.direccion || undefined,
              email: user.taller.email || undefined,
              descripcion: user.taller.descripcion || undefined,
              logo: user.taller.logo || undefined
            } : undefined
          }
        } catch (error) {
          console.error('Error en authorize:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.plan = user.plan
        token.taller = user.taller
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.plan = token.plan as string
        session.user.taller = token.taller as Taller | undefined
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}