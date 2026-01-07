import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/db'

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { matricula } = await context.params

    const vehicle = await prisma.vehicle.findUnique({
      where: { matricula },
      include: {
        owner: true,
        services: {
          orderBy: { fecha: 'desc' }
        },
        notes: {
          orderBy: { fecha: 'desc' }
        }
      }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
