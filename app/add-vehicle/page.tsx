"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AddVehicle() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    matricula: "",
    marca: "",
    modelo: "",
    pais: "",
    ultimoKilometraje: "",
    proximoService: "",
    owner: {
      nombre: "",
      telefono: "",
      email: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const matricula = searchParams.get("matricula");
    if (matricula) {
      setFormData((prev) => ({ ...prev, matricula }));
    }
  }, [searchParams]);

  // Verificar si el usuario puede agregar vehículos
  const canAddVehicle = session && (
    session.user.role === "admin" || 
    session.user.plan === "verified" || 
    session.user.plan === "premium"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canAddVehicle) {
      setError("La función 'Agregar vehículo' no está disponible en tu plan actual");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.error || "Error al crear el vehículo");
      }      
    } catch (error) {
      setError("Error de conexión");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("owner.")) {
      const ownerField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        owner: {
          ...prev.owner,
          [ownerField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Mostrar loading mientras se verifica la sesión
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Usuario no logueado
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No se encontró la matrícula</h2>
          <p className="text-gray-600 mb-4">
            La matrícula &quot;{searchParams.get('matricula')}&quot; no está registrada en el sistema.
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Iniciar Sesión
          </button>
          <button
              onClick={() => router.push("/")}
              className="ml-2 bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Volver al Inicio
            </button>
        </div>
      </div>
    );
  }

  // Usuario con plan Free
  if (session.user.plan === "free") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-yellow-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Función no disponible</h2>
          <p className="text-gray-600 mb-2">
            La función &quot;Agregar vehículo&quot; no está disponible en el plan Free.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Actualiza tu plan para acceder a todas las funcionalidades.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/dashboard/perfil")}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Mejorar Plan
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Usuario con plan Verificado, Premium o Admin - Mostrar formulario completo
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Header con info del plan */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Agregar Nuevo Vehículo
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Plan: <span className="font-semibold capitalize">{session.user.plan}</span>
                {session.user.role === "admin" && " • Administrador"}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Matrícula: {formData.matricula || "No especificada"}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Datos del Vehículo */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Datos del Vehículo
                </h2>

                <div>
                  <label
                    htmlFor="matricula"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Matrícula *
                  </label>
                  <input
                    type="text"
                    id="matricula"
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleChange}
                    required
                    className="text-gray-500 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="marca"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Marca *
                  </label>
                  <input
                    type="text"
                    id="marca"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    required
                    className="text-gray-500 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="modelo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Modelo *
                  </label>
                  <input
                    type="text"
                    id="modelo"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    required
                    className="text-gray-500 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="pais"
                    className="block text-sm font-medium text-gray-700"
                  >
                    País *
                  </label>
                  <input
                    type="text"
                    id="pais"
                    name="pais"
                    value={formData.pais}
                    onChange={handleChange}
                    required
                    className="text-gray-500 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="ultimoKilometraje"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Último Kilometraje
                    </label>
                    <input
                      type="number"
                      id="ultimoKilometraje"
                      name="ultimoKilometraje"
                      value={formData.ultimoKilometraje}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: 50000"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="proximoService"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Próximo Service (km)
                    </label>
                    <input
                      type="number"
                      id="proximoService"
                      name="proximoService"
                      value={formData.proximoService}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: 55000"
                    />
                  </div>
                </div>
              </div>

              {/* Datos del Dueño */}
              <div className="space-y-4">
                <h2 className="text-gray-700 text-lg font-semibold">
                  Datos del Dueño
                </h2>

                <div>
                  <label
                    htmlFor="owner.nombre"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="owner.nombre"
                    name="owner.nombre"
                    value={formData.owner.nombre}
                    onChange={handleChange}
                    required
                    className="text-gray-500 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="owner.telefono"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="owner.telefono"
                    name="owner.telefono"
                    value={formData.owner.telefono}
                    onChange={handleChange}
                    required
                    className="text-gray-500 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="owner.email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="owner.email"
                    name="owner.email"
                    value={formData.owner.email}
                    onChange={handleChange}
                    className="text-gray-500 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar Vehículo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}