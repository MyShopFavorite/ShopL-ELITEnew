'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Producto } from '@/types/database';

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerProductos() {
      try {
        // Petición a la tabla 'productos' en Supabase
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .eq('activo', true);

        if (error) throw error;
        if (data) setProductos(data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      } finally {
        setCargando(false);
      }
    }

    obtenerProductos();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Encabezado */}
      <header className="max-w-5xl mx-auto py-8 text-center border-b border-slate-800">
        <h1 className="text-4xl font-extrabold tracking-tight text-amber-400">
          L' ÉLITE
        </h1>
        <p className="mt-2 text-slate-400 text-sm">
          Exclusividad y Estilo en cada detalle
        </p>
      </header>

      {/* Catálogo de Productos */}
      <section className="max-w-5xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6 text-slate-200">
          Catálogo Destacado
        </h2>

        {cargando ? (
          <div className="text-center py-12 text-slate-500 animate-pulse">
            Cargando catálogo...
          </div>
        ) : productos.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-300 font-medium">
              No hay productos registrados aún.
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Añade registros a la tabla <code className="text-amber-400">productos</code> desde tu Dashboard de Supabase.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-amber-400/50 transition-colors"
              >
                <div>
                  {producto.imagen_principal ? (
                    <img
                      src={producto.imagen_principal}
                      alt={producto.nombre}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-800 rounded-lg mb-4 flex items-center justify-center text-slate-600">
                      Sin imagen
                    </div>
                  )}
                  <h3 className="font-bold text-lg text-white">
                    {producto.nombre}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {producto.descripcion || 'Sin descripción disponible.'}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xl font-bold text-amber-400">
                    ${producto.precio.toLocaleString()}
                  </span>
                  <button className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
