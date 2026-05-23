"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createClient,
  updateClient,
  type Client,
} from "../_api/clients.api";
import { formatDocument } from "../_utils/format-document";

type ClientFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
  onSuccess: () => void;
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

  return "Nao foi possivel salvar o cliente.";
}

type ClientFormFieldsProps = {
  client?: Client | null;
  onSuccess: () => void;
  onClose: () => void;
};

function ClientFormFields({
  client,
  onSuccess,
  onClose,
}: ClientFormFieldsProps) {
  const isEditing = Boolean(client);
  const [name, setName] = useState(client?.name ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [document, setDocument] = useState(
    client ? formatDocument(client.document, client.documentType) : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing && client) {
        await updateClient(client.id, { name, email, document });
      } else {
        await createClient({ name, email, document });
      }

      onSuccess();
      onClose();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="client-name">Nome / Razao social</Label>
        <Input
          id="client-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-email">Email</Label>
        <Input
          id="client-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client-document">CNPJ ou CPF</Label>
        <Input
          id="client-document"
          value={document}
          onChange={(event) => setDocument(event.target.value)}
          placeholder="00.000.000/0000-00 ou 000.000.000-00"
          required
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ClientFormDialog({
  open,
  onOpenChange,
  client,
  onSuccess,
}: ClientFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {client ? "Editar cliente" : "Novo cliente"}
          </DialogTitle>
          <DialogDescription>
            Informe nome/razao social, email e CNPJ ou CPF.
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <ClientFormFields
            key={client?.id ?? "new"}
            client={client}
            onSuccess={onSuccess}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
