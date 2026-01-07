/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface PerfilTabProps {
  session: any
  tallerData: any
  onUpdate: () => void
}

interface TallerData {
  nombre: string
  contacto: string
  telefono: string
  direccion: string
  email: string
  descripcion: string
  logo?: string
}

export default function PerfilTab({ session, tallerData, onUpdate }: PerfilTabProps) {
  const { update } = useSession()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<TallerData>({
    nombre: '',
    contacto: '',
    telefono: '',
    direccion: '',
    email: '',
    descripcion: '',
    logo: ''
  })

  // Cargar datos cuando la sesión esté disponible
  useEffect(() => {
    if (tallerData) {
      setFormData({
        nombre: tallerData.nombre || '',
        contacto: tallerData.contacto || '',
        telefono: tallerData.telefono || '',
        direccion: tallerData.direccion || '',
        email: tallerData.email || '',
        descripcion: tallerData.descripcion || '',
        logo: tallerData.logo || ''
      })
    }
  }, [tallerData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/taller/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage('Perfil actualizado correctamente')
        await update()
        onUpdate() // Actualizar datos en el dashboard
      } else {
        const data = await response.json()
        setError(data.error || 'Error al actualizar el perfil')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Editar Perfil del Taller</h2>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Taller *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mi Taller Automotriz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Contacto *
              </label>
              <input
                type="text"
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+54 11 1234-5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de contacto
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contacto@mitaller.com"
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Información Adicional</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Av. Siempre Viva 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción del Taller
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe los servicios que ofrece tu taller, especialidades, etc."
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => {
              if (tallerData) {
                setFormData({
                  nombre: tallerData.nombre || '',
                  contacto: tallerData.contacto || '',
                  telefono: tallerData.telefono || '',
                  direccion: tallerData.direccion || '',
                  email: tallerData.email || '',
                  descripcion: tallerData.descripcion || '',
                  logo: tallerData.logo || ''
                })
              }
            }}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Restablecer
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>

      {/* Vista previa */}
      <div className="mt-8 bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vista Previa del Perfil</h3>
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="flex items-center gap-4 mb-4">
            {formData.logo && (
              <Image 
                src={formData.logo} 
                alt="Logo del taller" 
                width={64}
                height={64}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h4 className="text-xl font-bold text-gray-800">{formData.nombre || 'Nombre del Taller'}</h4>
              <p className="text-gray-600">{formData.descripcion || 'Descripción del taller'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {formData.contacto && (
              <p><strong>Contacto:</strong> {formData.contacto}</p>
            )}
            {formData.telefono && (
              <p><strong>Teléfono:</strong> {formData.telefono}</p>
            )}
            {formData.email && (
              <p><strong>Email:</strong> {formData.email}</p>
            )}
            {formData.direccion && (
              <p><strong>Dirección:</strong> {formData.direccion}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}