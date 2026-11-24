// Convierte un número en pesos colombianos: 20000 → "$ 20.000"
// Intl.NumberFormat viene incluido en JavaScript y sabe cómo se escriben
// los precios en Colombia (punto para los miles y sin decimales).
// const = una variable que no se vuelve a asignar
const pesos = new Intl.NumberFormat('es-CO', {
  style: 'currency', // formato de moneda
  currency: 'COP', // pesos colombianos
  maximumFractionDigits: 0, // sin decimales
});

// export function = una función que se puede usar en otros archivos.
// Recibe un número (valor: number) y devuelve un texto (: string)
export function formatearPesos(valor: number): string {
  return pesos.format(valor);
}
