import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  // Crear usuario administrador
await prisma.user.create({
  data: {
    email: 'admin@miservice.com',
    password: hashedPassword,
    name: 'Administrador',
    role: 'admin',
    plan: 'admin',
    taller: {
      create: {
        nombre: 'Administración Sistema'
      }
    }
  }
})

  console.log('Usuario de prueba creado:')
  console.log('Email: admin@miservice.com')
  console.log('Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })