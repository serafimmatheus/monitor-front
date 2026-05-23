"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { importClients } from "../_api/clients.api";

type ImportClientsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

function getErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return "Nao foi possivel importar a planilha.";
}

export function ImportClientsDialog({
  open,
  onOpenChange,
  onSuccess,
  onError,
}: ImportClientsDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target.files?.[0] ?? null);
  }

  async function handleImport() {
    if (!selectedFile) {
      onError("Selecione um arquivo CSV ou XLSX.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await importClients(selectedFile);
      const errorCount = result.errors.length;
      const message = `${result.imported} cliente(s) importado(s), ${result.skipped} ignorado(s)${errorCount > 0 ? `, ${errorCount} com erro` : ""}.`;

      onSuccess(message);
      setSelectedFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onOpenChange(false);
    } catch (importError) {
      onError(getErrorMessage(importError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar planilha</DialogTitle>
          <DialogDescription>
            Envie um arquivo CSV ou XLSX com as colunas: nome/razao social,
            email e cnpj/cpf.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
          />
          {selectedFile ? (
            <p className="text-sm text-muted-foreground">
              Arquivo selecionado: {selectedFile.name}
            </p>
          ) : null}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={isSubmitting || !selectedFile}
          >
            <Upload className="size-4" />
            {isSubmitting ? "Importando..." : "Importar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
