import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/db'
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Verificar si es admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validar campos requeridos
    if (!body.nombre || !body.contacto) {
      return NextResponse.json(
        { error: 'Nombre y contacto son campos requeridos' },
        { status: 400 }
      )
    }

    // Crear usuario temporal para el taller
    const tempEmail = `taller.${Date.now()}@miservice.com`;
    const tempPassword = 'temp123';

    // Crear usuario y taller
    const user = await prisma.user.create({
      data: {
        email: tempEmail,
        password: tempPassword, // En producción, deberías hashear esta contraseña
        name: body.contacto,
        role: 'user',
        plan: 'free',
        taller: {
          create: {
            nombre: body.nombre,
            contacto: body.contacto,
            telefono: body.telefono,
            email: body.email,
            direccion: body.direccion,
            descripcion: body.descripcion,
            logo: body.logo
          }
        }
      },
      include: {
        taller: true
      }
    })

    return NextResponse.json(
      { 
        message: 'Taller creado exitosamente',
        taller: user.taller,
        usuario: {
          email: tempEmail,
          password: tempPassword // Solo para desarrollo
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al crear el taller' },
      { status: 500 }
    )
  }
}