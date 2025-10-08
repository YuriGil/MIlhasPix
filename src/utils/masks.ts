export function maskCPF(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 13); 
  if (digits.startsWith("55")) {
    const rest = digits.slice(2);
    if (rest.length <= 2) return `+55 (${rest}`;
    if (rest.length <= 7) return `+55 (${rest.slice(0, 2)}) ${rest.slice(2)}`;
    if (rest.length <= 11) return `+55 (${rest.slice(0, 2)}) ${rest.slice(2, rest.length - 4)}-${rest.slice(-4)}`;
  } else {
    const d = digits;
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
  }
  return value;
}
