"use client";

import {
  CircleUserRound,
  UserRoundCog,
  Menu,
  X,
  ShieldUser,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="Inicio">
              <Image
                src="/logo.png"
                alt="MiService logo"
                width={300}
                height={80}
                className="p-6 mt-1"
              />
            </Link>
          </div>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-white hover:text-blue-200 flex items-center gap-1"
                  title="Dashboard"
                >
                  <CircleUserRound size={20} />
                </Link>
                {session?.user?.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="text-white hover:text-blue-200"
                  >
                    <ShieldUser />
                  </Link>
                )}
                <span className="hidden lg:inline">
                  Hola, {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href={`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
              >
                Login
              </Link>
            )}
          </div>

          {/* Botón Menú Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-200 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú Mobile */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-blue-500">
            {session ? (
              <div className="flex flex-col space-y-3 pt-4">
                <div className="flex items-center gap-2 text-sm text-blue-100">
                  <CircleUserRound size={16} />
                  <span>Hola, {session.user?.name}</span>
                </div>

                <Link
                  href="/dashboard"
                  className="text-white hover:text-blue-200 flex items-center gap-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CircleUserRound size={18} />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/perfil"
                  className="text-white hover:text-blue-200 flex items-center gap-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserRoundCog size={18} />
                  Perfil
                </Link>

                {session?.user?.role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="text-white hover:text-blue-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Administración
                  </Link>
                )}

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md text-left"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="pt-4">
                <Link
                  href="/auth/login"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
