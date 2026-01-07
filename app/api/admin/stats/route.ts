import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si es admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener estadísticas
    const [
      totalVehicles,
      totalUsers,
      totalServices,
      totalTalleres
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.user.count(),
      prisma.service.count(),
      prisma.taller.count()
    ])

    return NextResponse.json({
      totalVehicles,
      totalUsers,
      totalServices,
      totalTalleres
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}