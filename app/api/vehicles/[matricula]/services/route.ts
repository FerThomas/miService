import { NextRequest, NextResponse } from "next/server";
import { prisma } from "lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ matricula: string }> }
) {
  try {
    const { matricula } = await params;
    const body = await request.json();
    //console.log("Body recibido en el servidor:", body);
    // Buscar el vehículo por matrícula
    const vehicle = await prisma.vehicle.findUnique({
      where: { matricula },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehículo no encontrado" },
        { status: 404 }
      );
    }

    // Crear el service
    const service = await prisma.service.create({
      data: {
        fecha: new Date(body.fecha),
        taller: body.taller,
        descripcion: body.descripcion,
        repuestos: body.repuestos || null,
        costo: body.costo || null,
        vehicleId: vehicle.id,
      },
    });

    // Actualizar el kilometraje y próximo service del vehículo si se proporcionaron
    if (body.kilometraje || body.proximoService) {
      await prisma.vehicle.update({
        where: { matricula },
        data: {
          ...(body.kilometraje && {
            ultimoKilometraje: parseInt(body.kilometraje),
          }),
          ...(body.proximoService && {
            proximoService: parseInt(body.proximoService),
          }),
        },
      });
    }

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al crear el service" },
      { status: 500 }
    );
  }
}
