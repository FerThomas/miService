import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const vehicle = await prisma.vehicle.create({
      data: {
        matricula: body.matricula,
        marca: body.marca,
        modelo: body.modelo,
        pais: body.pais,
        ultimoKilometraje: body.ultimoKilometraje ? parseInt(body.ultimoKilometraje) : null,
        proximoService: body.proximoService ? parseInt(body.proximoService) : null,
        owner: {
          create: {
            nombre: body.owner.nombre,
            telefono: body.owner.telefono,
            email: body.owner.email
          }
        }
      },
      include: {
        owner: true
      }
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al crear el vehículo' },
      { status: 500 }
    )
  }
}