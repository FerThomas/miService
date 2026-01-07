/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PerfilTab from "./PerfilTab";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tallerData, setTallerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("estadisticas");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Combinar datos de session y API para asegurar todos los campos
    if (session.user.taller) {
      console.log('Taller desde session:', session.user.taller);
      setTallerData(session.user.taller);
      setLoading(false);
    } else {
      fetchTallerData();
    }
  }, [session, status, router]);

  const fetchTallerData = async () => {
    try {
      const response = await fetch("/api/taller/perfil");
      if (response.ok) {
        const data = await response.json();
        console.log('Taller desde API:', data);
        setTallerData(data);
      }
    } catch (error) {
      console.error("Error cargando datos del taller:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Combinar datos para asegurar que tengamos todos los campos
  const datosCompletos = {
    ...tallerData,
    ...session.user.taller
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-500">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Panel de Control
              </h1>
              <p className="text-gray-600">Gestión de tu taller</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                Conectado como:{" "}
                <span className="font-semibold">{session.user.name}</span>
              </div>
              <div className="text-sm text-gray-500">
                Taller:{" "}
                <span className="font-semibold">
                  {datosCompletos?.nombre || "Sin nombre"}
                </span>
              </div>
              <div className="bg-yellow-50 rounded-lg border border-yellow-100 mt-2 p-2">
                <div className="flex items-center gap-2">
                  <div className="shrink-0">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">P</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-yellow-600">
                      Plan Actual
                    </p>
                    <p className="text-sm font-bold text-yellow-900 capitalize">
                      {session.user.plan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "estadisticas", name: "Resumen" },
              { id: "perfil", name: "Mi Perfil" },
              { id: "services", name: "Services" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              {activeTab === "estadisticas" && (
                <EstadisticasTab session={session} tallerData={datosCompletos} />
              )}
              {activeTab === "perfil" && (
                <PerfilTab
                  session={session}
                  tallerData={datosCompletos}
                  onUpdate={fetchTallerData}
                />
              )}
              {activeTab === "services" && <ServicesTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Estadísticas
function EstadisticasTab({
  
  tallerData,
}: {
  session: any;
  tallerData: any;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Resumen del Taller
      </h2>
      
      {/* Información del Taller - MOSTRAR TODOS LOS CAMPOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Información del Taller
          </h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Nombre:</span>
              <p className="text-gray-900">
                {tallerData?.nombre || "No especificado"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Contacto:</span>
              <p className="text-gray-900">
                {tallerData?.contacto || "No especificado"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Teléfono:</span>
              <p className="text-gray-900">
                {tallerData?.telefono || "No especificado"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-900">
                {tallerData?.email || "No especificado"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Dirección:</span>
              <p className="text-gray-900">
                {tallerData?.direccion || "No especificada"}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Descripción:</span>
              <p className="text-gray-900">
                {tallerData?.descripcion || "No especificada"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full text-left p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-800">Buscar Vehículo</span>
              <p className="text-sm text-gray-600">Buscar por matrícula</p>
            </button>
            <button className="w-full text-left p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="font-medium text-gray-800">Agregar Service</span>
              <p className="text-sm text-gray-600">Registrar nuevo service</p>
            </button>
            <button className="w-full text-left p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="font-medium text-gray-800">Ver Historial</span>
              <p className="text-sm text-gray-600">
                Consultar services anteriores
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Services Realizados
      </h2>
      <p className="text-gray-600">
        Historial de services realizados por tu taller.
      </p>
    </div>
  );
}