"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
//import Navbar from "components/NavBar";

export default function Home() {
  const [matricula, setMatricula] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!matricula.trim()) {
      setError("Por favor ingrese una matrícula");
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${matricula}`);
      if (response.ok) {
        router.push(`/vehicle/${matricula}`);
      } else if (response.status === 404) {
        router.push(`/add-vehicle?matricula=${matricula}`);
      } else {
        setError("Error al buscar la matrícula");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Error de conexión");
    }
  };

  return (
    <div>
      
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema de Gestión Vehicular
            </h2>
            <p className="text-gray-600">
              Busque un vehículo por matrícula para ver su historial completo
            </p>
          </div>

          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label
                  htmlFor="matricula"
                  className="block text-sm font-medium text-gray-800"
                >
                  Matrícula del Vehículo
                </label>
                <input
                  type="text"
                  id="matricula"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: ABC123"
                />
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Buscar Vehículo
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
