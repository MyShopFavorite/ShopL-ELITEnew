'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Ajusta la ruta a tu cliente de Supabase

export default function AdminPage() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagen) {
      setMensaje({ tipo: 'error', texto: 'Por favor selecciona una imagen.' });
      return;
    }

    setCargando(true);
    setMensaje(null);

    try {
      // 1. Subir la imagen al Storage Bucket "productos"
      const nombreArchivo = `${Date.now()}-${imagen.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('productos')
        .upload(nombreArchivo, imagen);

      if (storageError) throw storageError;

      // 2. Obtener la URL pública de la imagen subida
      const { data: urlData } = supabase.storage
        .from('productos')
        .getPublicUrl(nombreArchivo);

      const imagenUrl = urlData.publicUrl;

      // 3. Guardar el nuevo producto en la tabla 'productos'
      const { error: dbError } = await supabase
        .from('productos')
        .insert([
          {
            nombre,
            precio: parseFloat(precio),
            descripcion,
            imagen_url: imagenUrl,
          },
        ]);

      if (dbError) throw dbError;

      setMensaje({ tipo: 'exito', texto: '¡Producto creado con éxito!' });
      // Limpiar campos
      setNombre('');
      setPrecio('');
      setDescripcion('');
      setImagen(null);
    } catch (error: any) {
      setMensaje({ tipo: 'error', texto: error.message || 'Error al guardar el producto' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Panel de Administración - Crear Producto</h2>

      {mensaje && (
        <p style={{ color: mensaje.tipo === 'exito' ? 'green' : 'red' }}>
          {mensaje.texto}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Nombre del Producto:</label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>Precio ($):</label>
          <input
            type="number"
            step="0.01"
            required
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>Imagen del Producto:</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => e.target.files && setImagen(e.target.files[0])}
            style={{ width: '100%', marginTop: '5px' }}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {cargando ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </form>
    </div>
  );
}
