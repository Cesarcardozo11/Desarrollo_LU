// Convierte un número en pesos colombianos: 20000 → "$ 20.000"
// Intl.NumberFormat viene incluido en JavaScript y sabe cómo se escriben
// los precios en Colombia (punto para los miles y sin decimales).
const pesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export function formatearPesos(valor: number): string {
  return pesos.format(valor);
}
