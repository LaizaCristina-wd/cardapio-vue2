export function formatarMoeda(valor){
 if (!valor) return ""

  valor = valor
    .toString()
    .replace(/[^\d]/g, "")

 if (!valor) return ""
  valor = (Number(valor) / 100).toFixed(2)

  valor = valor
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  return ` R$ ${valor}`
}