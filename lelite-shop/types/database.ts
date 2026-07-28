export interface Producto {
  id?: string | number;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen_url?: string;
  categoria?: string;
  stock?: number;
  created_at?: string;
}
