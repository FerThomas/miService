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

    // 🔥 **AQUÍ ESTÁ LA MAGIA DE PRISMA** 🔥
    // Obtener todos los vehículos con sus dueños
    const vehicles = await prisma.vehicle.findMany({
      include: {
        owner: true, // Incluir datos del dueño
        services: true, // Incluir servicios (opcional)
      },
      orderBy: {
        createdAt: 'desc' // Ordenar por fecha de creación (más nuevos primero)
      }
    })

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al obtener vehículos' },
      { status: 500 }
    )
  }
}