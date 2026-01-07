/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BookOpenText, PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

interface Stats {
  totalVehicles: number;
  totalUsers: number;
  totalServices: number;
  totalTalleres: number;
}

interface AdminDashboardClientProps {
  session: any;
  stats: Stats;
  vehicles: any[];
  users: any[];
  talleres: any[];
  services: any[];
}

export default function AdminDashboardClient({
  session,
  stats,
  vehicles,
  users,
  talleres,
  services,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-100 text-gray-500">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-gray-600">Gestión completa del sistema</p>
            </div>
            <div className="text-sm text-gray-500">
              Conectado como:{" "}
              <span className="font-semibold">{session.user.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", name: "Resumen" },
              { id: "vehicles", name: "Vehículos" },
              { id: "users", name: "Usuarios" },
              { id: "talleres", name: "Talleres" },
              { id: "services", name: "Services" },
              { id: "add_taller", name: "Agregar Taller" },
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
          {/* Resumen General */}
          {activeTab === "overview" && stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">V</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Vehículos
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalVehicles}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">U</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Usuarios
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalUsers}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">T</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Talleres
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalTalleres}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">S</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Services
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalServices}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contenido de cada pestaña */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              {activeTab === "overview" && <OverviewTab stats={stats} />}
              {activeTab === "vehicles" && <VehiclesTab vehicles={vehicles} />}
              {activeTab === "users" && <UsersTab users={users} />}
              {activeTab === "talleres" && <TalleresTab talleres={talleres} />}
              {activeTab === "services" && <ServicesTab services={services} />}
              {activeTab === "add_taller" && <AddTallerTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes para cada pestaña
function OverviewTab({ stats }: { stats: Stats }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Resumen General
      </h2>
      <p className="text-gray-600">
        Vista general de todas las estadísticas del sistema.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700">Distribución</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>• {stats.totalVehicles} vehículos registrados</li>
            <li>• {stats.totalUsers} usuarios activos</li>
            <li>• {stats.totalTalleres} talleres en plataforma</li>
            <li>• {stats.totalServices} services realizados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

import {Search } from "lucide-react";
import { useMemo } from "react";

function VehiclesTab({ vehicles }: { vehicles: any[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("matricula"); // Campo por defecto

  // Filtrar vehículos basado en la búsqueda
  const filteredVehicles = useMemo(() => {
    if (!searchTerm.trim()) return vehicles;

    return vehicles.filter((vehicle) => {
      const term = searchTerm.toLowerCase();
      
      switch (searchField) {
        case "matricula":
          return vehicle.matricula.toLowerCase().includes(term);
        case "marca":
          return vehicle.marca.toLowerCase().includes(term);
        case "modelo":
          return vehicle.modelo.toLowerCase().includes(term);
        case "pais":
          return vehicle.pais.toLowerCase().includes(term);
        case "dueño":
          return vehicle.owner?.nombre?.toLowerCase().includes(term) || false;
        default:
          return true;
      }
    });
  }, [vehicles, searchTerm, searchField]);

  const handleSearch = async (matricula: string) => {
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
    } catch (error) {
      setError("Error de conexión");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Vehículos ({filteredVehicles.length})
        </h2>
      </div>

      {/* Buscador */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Campo de selección */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por:
            </label>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="matricula">Matrícula</option>
              <option value="marca">Marca</option>
              <option value="modelo">Modelo</option>
              <option value="pais">País</option>
              <option value="dueño">Dueño</option>
            </select>
          </div>

          {/* Campo de búsqueda */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Término de búsqueda:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Buscar por ${searchField}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Botón limpiar */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchField("matricula");
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Mostrar término de búsqueda actual */}
        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600">
            Mostrando {filteredVehicles.length} de {vehicles.length} vehículos
            {searchTerm && (
              <span> para &quot;{searchTerm}&quot; en {searchField}</span>
            )}
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matrícula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marca / Modelo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dueño
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                País
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Editar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {vehicle.matricula}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vehicle.marca}</div>
                    <div className="text-sm text-gray-500">{vehicle.modelo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vehicle.owner ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.owner.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.owner.telefono}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Sin dueño</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.pais}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(vehicle.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={undefined}
                      className="bg-blue-700 hover:bg-blue-800 p-1 rounded-md hover:cursor-pointer"
                    >
                      <PencilLine className="text-white" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleSearch(vehicle.matricula)}
                      className="bg-blue-700 hover:bg-blue-800 p-1 rounded-md hover:cursor-pointer"
                    >
                      <BookOpenText className="text-white" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? (
                    <div>
                      <p>No se encontraron vehículos para &quot;{searchTerm}&quot; en {searchField}</p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-blue-600 hover:text-blue-800"
                      >
                        Mostrar todos los vehículos
                      </button>
                    </div>
                  ) : (
                    "No hay vehículos registrados"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersTab({ users }: { users: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("nombre"); // Campo por defecto

  // Filtrar usuarios basado en la búsqueda
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    return users.filter((user) => {
      const term = searchTerm.toLowerCase();
      
      switch (searchField) {
        case "nombre":
          return user.name.toLowerCase().includes(term);
        case "email":
          return user.email.toLowerCase().includes(term);
        case "rol":
          return user.role.toLowerCase().includes(term);
        case "plan":
          return user.plan.toLowerCase().includes(term);
        case "taller":
          return user.taller?.nombre?.toLowerCase().includes(term) || false;
        default:
          return true;
      }
    });
  }, [users, searchTerm, searchField]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Usuarios ({filteredUsers.length})
        </h2>
      </div>

      {/* Buscador */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Campo de selección */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por:
            </label>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nombre">Nombre</option>
              <option value="email">Email</option>
              <option value="rol">Rol</option>
              <option value="plan">Plan</option>
              <option value="taller">Taller</option>
            </select>
          </div>

          {/* Campo de búsqueda */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Término de búsqueda:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Buscar por ${searchField}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Botón limpiar */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchField("nombre");
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Mostrar término de búsqueda actual */}
        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600">
            Mostrando {filteredUsers.length} de {users.length} usuarios
            {searchTerm && (
              <span> para &quot;{searchTerm}&quot; en {searchField}</span>
            )}
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol / Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taller
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.taller?.nombre || "Sin taller"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? (
                    <div>
                      <p>No se encontraron usuarios para &quot;{searchTerm}&quot; en {searchField}</p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-blue-600 hover:text-blue-800"
                      >
                        Mostrar todos los usuarios
                      </button>
                    </div>
                  ) : (
                    "No hay usuarios registrados"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TalleresTab({ talleres }: { talleres: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("nombre"); // Campo por defecto

  // Filtrar talleres basado en la búsqueda
  const filteredTalleres = useMemo(() => {
    if (!searchTerm.trim()) return talleres;

    return talleres.filter((taller) => {
      const term = searchTerm.toLowerCase();
      
      switch (searchField) {
        case "nombre":
          return taller.nombre.toLowerCase().includes(term);
          case "contacto":
          return taller.contacto.toLowerCase().includes(term);
        case "telefono":
          return taller.telefono?.toLowerCase().includes(term) || false;
        case "email":
          return taller.email?.toLowerCase().includes(term) || false;
        case "direccion":
          return taller.direccion?.toLowerCase().includes(term) || false;
        default:
          return true;
      }
    });
  }, [talleres, searchTerm, searchField]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Talleres ({filteredTalleres.length})
        </h2>
      </div>

      {/* Buscador */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Campo de selección */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por:
            </label>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nombre">Nombre</option>
              <option value="contacto">Dueño</option>
              <option value="telefono">Teléfono</option>
              <option value="email">Email</option>
              <option value="direccion">Dirección</option>
            </select>
          </div>

          {/* Campo de búsqueda */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Término de búsqueda:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Buscar por ${searchField}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Botón limpiar */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchField("nombre");
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Mostrar término de búsqueda actual */}
        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600">
            Mostrando {filteredTalleres.length} de {talleres.length} talleres
            {searchTerm && (
              <span> para &quot;{searchTerm}&quot; en {searchField}</span>
            )}
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dueño
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTalleres.length > 0 ? (
              filteredTalleres.map((taller) => (
                <tr key={taller.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {taller.nombre}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {taller.contacto}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{taller.telefono || "No especificado"}</div>
                    <div className="text-sm text-gray-500">{taller.email || "No especificado"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {taller.direccion || "No especificada"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(taller.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? (
                    <div>
                      <p>No se encontraron talleres para &quot;{searchTerm}&quot; en {searchField}</p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-blue-600 hover:text-blue-800"
                      >
                        Mostrar todos los talleres
                      </button>
                    </div>
                  ) : (
                    "No hay talleres registrados"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ServicesTab({ services }: { services: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("taller"); // Campo por defecto

  // Filtrar services basado en la búsqueda
  const filteredServices = useMemo(() => {
    if (!searchTerm.trim()) return services;

    return services.filter((service) => {
      const term = searchTerm.toLowerCase();
      
      switch (searchField) {
        case "taller":
          return service.taller.toLowerCase().includes(term);
        case "matricula":
          return service.vehicle.matricula.toLowerCase().includes(term);
        case "dueño":
          return service.vehicle.owner.nombre.toLowerCase().includes(term);
        case "descripcion":
          return service.descripcion.toLowerCase().includes(term);
        default:
          return true;
      }
    });
  }, [services, searchTerm, searchField]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Services ({filteredServices.length})
        </h2>
      </div>

      {/* Buscador */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Campo de selección */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por:
            </label>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="taller">Taller</option>
              <option value="matricula">Matrícula</option>
              <option value="dueño">Dueño</option>
              <option value="descripcion">Descripción</option>
            </select>
          </div>

          {/* Campo de búsqueda */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Término de búsqueda:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Buscar por ${searchField}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Botón limpiar */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchField("taller");
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Mostrar término de búsqueda actual */}
        {searchTerm && (
          <div className="mt-3 text-sm text-gray-600">
            Mostrando {filteredServices.length} de {services.length} services
            {searchTerm && (
              <span> para &quot;{searchTerm}&quot; en {searchField}</span>
            )}
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taller
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehículo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(service.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.taller}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {service.vehicle.matricula}
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.vehicle.owner.nombre}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {service.descripcion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.costo ? `$${service.costo.toLocaleString()}` : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? (
                    <div>
                      <p>No se encontraron services para &quot;{searchTerm}&quot; en {searchField}</p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-blue-600 hover:text-blue-800"
                      >
                        Mostrar todos los services
                      </button>
                    </div>
                  ) : (
                    "No hay services registrados"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddTallerTab() {
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    descripcion: '',
    logo: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/talleres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Taller creado exitosamente');
        setFormData({
          nombre: '',
          contacto: '',
          telefono: '',
          email: '',
          direccion: '',
          descripcion: '',
          logo: ''
        });
      } else {
        const data = await response.json();
        setError(data.error || 'Error al crear el taller');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Agregar Nuevo Taller
      </h2>

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

      <div className="bg-white p-6 rounded-lg shadow border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Básica */}
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
                  placeholder="Ej: Taller Mecánico Central"
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
                  placeholder="Ej: Carlos Rodríguez"
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
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="taller@ejemplo.com"
                />
              </div>
            </div>

            {/* Información Adicional */}
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
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe los servicios que ofrece el taller..."
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setFormData({
                nombre: '',
                contacto: '',
                telefono: '',
                email: '',
                direccion: '',
                descripcion: '',
                logo: ''
              })}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Limpiar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creando Taller...' : 'Crear Taller'}
            </button>
          </div>
        </form>
      </div>

      {/* Vista Previa */}
      {formData.nombre && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vista Previa del Taller</h3>
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="flex items-center gap-4 mb-4">
              {formData.logo && (
                <Image
                  src={formData.logo} 
                  alt="Logo preview" 
                  width={64} 
                  height={64}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h4 className="text-xl font-bold text-gray-800">{formData.nombre}</h4>
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
      )}
    </div>
  );
}


