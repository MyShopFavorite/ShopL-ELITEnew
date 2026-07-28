import { createClient } from '@supabase/supabase-js';

// Leemos las claves declaradas en .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Creamos e exportamos el cliente único para toda la app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// src/types/database.ts

// ... tus interfaces anteriores (Categoria, Producto) ...

export interface Perfil {
  id: string;
  nombre: string;
  rol: 'admin' | 'cliente';
  creado_en: string;
}
