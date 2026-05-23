export function formatDocument(document: string, documentType: "CNPJ" | "CPF") {
  const digits = document.replace(/\D/g, "");

  if (documentType === "CPF" && digits.length === 11) {
    return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  if (documentType === "CNPJ" && digits.length === 14) {
    return digits.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  }

  return document;
}
