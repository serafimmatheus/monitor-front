"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SyncAlertProps {
  message: string | null;
  error: string | null;
  onClose: () => void;
}

export function SyncAlert({ message, error, onClose }: SyncAlertProps) {
  if (!message && !error) {
    return null;
  }

  return (
    <Alert variant={error ? "destructive" : "default"}>
      <AlertTitle>{error ? "Erro" : "Sincronizacao"}</AlertTitle>
      <AlertDescription className="flex items-center gap-2">
        <span>{error ?? message}</span>
        {!error && message ? (
          <button type="button" className="underline" onClick={onClose}>
            Fechar
          </button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
