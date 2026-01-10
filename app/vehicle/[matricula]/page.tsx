"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Vehicle {
  id: number;
  matricula: string;
  marca: string;
  modelo: string;
  pais: string;
  ultimoKilometraje?: number;
  proximoService?: number;
  owner: {
    nombre: string;
    telefono: string;
    email: string;
  };
  services: Array<{
    id: number;
    fecha: string;
    taller: string;
    descripcion: string;
    repuestos?: string;
    costo?: number;
  }>;
  notes: Array<{
    id: number;
    contenido: string;
    fecha: string;
  }>;
}

export default function VehicleDetail() {
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const [serviceForm, setServiceForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    taller: session?.user?.taller?.nombre.toString(),
    descripcion: "",
    repuestos: "",
    costo: "",
    kilometraje: "",
    proximoService: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const params = useParams();
  const router = useRouter();
  const matricula = params.matricula as string;

  useEffect(() => {
    fetchVehicle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matricula]);

  const fetchVehicle = async () => {
    try {
      const response = await fetch(`/api/vehicles/${matricula}`);
      if (response.ok) {
        const data = await response.json();
        setVehicle(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/vehicles/${matricula}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...serviceForm,
          costo: serviceForm.costo ? parseFloat(serviceForm.costo) : null,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setServiceForm({
          fecha: new Date().toISOString().split("T")[0],
          taller: session?.user?.taller?.nombre.toString(),
          descripcion: "",
          repuestos: "",
          costo: "",
          kilometraje: "",
          proximoService: "",
        });
        // Recargar los datos del vehículo
        fetchVehicle();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vehículo...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Vehículo no encontrado
          </h2>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {vehicle.marca} {vehicle.modelo}
              </h1>
              <p className="text-gray-700 text-lg">
                Matrícula: {vehicle.matricula}
              </p>
              <p className="text-gray-600">País: {vehicle.pais}</p>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicle.ultimoKilometraje && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">
                    Último Kilometraje
                  </p>
                  <p className="text-lg font-bold text-blue-900">
                    {vehicle.ultimoKilometraje.toLocaleString()} km
                  </p>
                </div>
              )}

              {vehicle.proximoService && (
                <div
                  className={`p-3 rounded-lg ${
                    vehicle.ultimoKilometraje &&
                    vehicle.ultimoKilometraje >= vehicle.proximoService
                      ? "bg-red-50"
                      : "bg-green-50"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-700">Próximo Service</p>
                  <p
                    className={`text-lg font-bold ${
                      vehicle.ultimoKilometraje &&
                      vehicle.ultimoKilometraje >= vehicle.proximoService
                        ? "text-red-900"
                        : "text-green-900"
                    }`}
                  >
                    {vehicle.proximoService.toLocaleString()} km
                  </p>
                  {vehicle.ultimoKilometraje && vehicle.proximoService && (
                    <p className="text-xs mt-1 text-gray-700">
                      {vehicle.ultimoKilometraje >= vehicle.proximoService
                        ? "⚠️ Service vencido"
                        : `Faltan ${(
                            vehicle.proximoService - vehicle.ultimoKilometraje
                          ).toLocaleString()} km`}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {session && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Agregar Service
                </button>
              )}
              <button
                onClick={() => router.back()}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Volver
              </button>
            </div>
          </div>
        </div>

        {/* Resto del código igual... */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Dueño */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Datos del Dueño
              </h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong className="text-gray-800">Nombre:</strong>{" "}
                  {vehicle.owner.nombre}
                </p>
                <p className="text-gray-700">
                  <strong className="text-gray-800">Teléfono:</strong>{" "}
                  {vehicle.owner.telefono}
                </p>
                <p className="text-gray-700">
                  <strong className="text-gray-800">Email:</strong>{" "}
                  {vehicle.owner.email || "No especificado"}
                </p>
              </div>
            </div>

            {/* Notas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Notas
              </h2>
              {vehicle.notes.length > 0 ? (
                <div className="space-y-3">
                  {vehicle.notes.map((note) => (
                    <div
                      key={note.id}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <p className="text-gray-700">{note.contenido}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(note.fecha).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No hay notas registradas</p>
              )}
            </div>
          </div>

          {/* Columna derecha - Services */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Historial de Services
                </h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {vehicle.services.length} servicios
                </span>
              </div>

              {vehicle.services.length > 0 ? (
                <div className="space-y-4">
                  {vehicle.services.map((service) => (
                    <div
                      key={service.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {service.taller}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {new Date(service.fecha).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-3">
                        {service.descripcion}
                      </p>

                      {service.repuestos && (
                        <div className="mb-2">
                          <strong className="text-gray-800">Repuestos:</strong>
                          <p className="text-gray-700">{service.repuestos}</p>
                        </div>
                      )}

                      {service.costo && (
                        <p className="text-green-700 font-semibold">
                          Costo: ${service.costo.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No hay servicios registrados</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal para agregar service */}
        {showModal && (          
          <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-gray-500">
            <div className="bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Agregar Nuevo Service
                </h2>
                <form onSubmit={handleSubmitService} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      name="fecha"
                      value={serviceForm.fecha}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taller
                    </label>
                    <input
                      type="text"
                      name="taller"
                      value={serviceForm.taller}
                      onChange={handleChange}
                      required
                      readOnly
                      className="placeholder-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none"
                      placeholder={
                        session?.user?.taller?.nombre || "No se encontró taller"
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción del Service
                    </label>
                    <textarea
                      name="descripcion"
                      value={serviceForm.descripcion}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descripción del trabajo realizado..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Repuestos Utilizados
                    </label>
                    <textarea
                      name="repuestos"
                      value={serviceForm.repuestos}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Lista de repuestos (opcional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Costo ($)
                    </label>
                    <input
                      type="number"
                      name="costo"
                      value={serviceForm.costo}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Costo del Service completo (opcional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kilometraje Actual
                    </label>
                    <input
                      type="number"
                      name="kilometraje"
                      value={serviceForm.kilometraje}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kilometraje al realizar el service"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Próximo Service (km) si aplica
                    </label>
                    <input
                      type="number"
                      name="proximoService"
                      value={serviceForm.proximoService}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: 55000"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? "Guardando..." : "Guardar Service"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
