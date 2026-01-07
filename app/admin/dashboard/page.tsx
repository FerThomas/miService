import { prisma } from '../../../lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  if (session.user.role !== 'admin') {
    redirect('/dashboard')
  }

  // Obtener todos los datos
  const [vehicles, users, talleres, services] = await Promise.all([
    prisma.vehicle.findMany({
      include: { owner: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.findMany({
      include: { taller: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.taller.findMany({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.service.findMany({
      include: { 
        vehicle: {
          include: { owner: true }
        }
      },
      orderBy: { fecha: 'desc' }
    })
  ])

  const stats = {
    totalVehicles: vehicles.length,
    totalUsers: users.length,
    totalServices: services.length,
    totalTalleres: talleres.length
  }

  return (
    <AdminDashboardClient
      session={session}
      stats={stats}
      vehicles={vehicles}
      users={users}
      talleres={talleres}
      services={services}
    />
  )
}