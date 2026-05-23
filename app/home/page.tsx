"use client";

import { useEffect, useState } from "react";
import { Plus, Upload } from "lucide-react";
import { AuthProtect } from "@/components/auth-protect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { ClientFormDialog } from "./_components/client-form-dialog";
import { ClientsTable } from "./_components/clients-table";
import { DeleteClientDialog } from "./_components/delete-client-dialog";
import { ImportClientsDialog } from "./_components/import-clients-dialog";
import { SyncAlert } from "./_components/sync-alert";
import { SyncButton } from "./_components/sync-button";
import type { Client } from "./_api/clients.api";
import { useClients } from "./_hook/use-clients";
import { useSync } from "./_hook/use-sync";

export default function HomePage() {
  const { user, logout } = useAuth();
  const [isSyncActive, setIsSyncActive] = useState(false);
  const { clients, isLoading, error, refetch } = useClients(isSyncActive);
  const { sync, isSyncing, message, error: syncError, clearMessage } = useSync(
    (queued) => {
      refetch();
      if (queued > 0) {
        setIsSyncActive(true);
      }
    },
  );

  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string | null;
    error: string | null;
  }>({ message: null, error: null });

  useEffect(() => {
    if (!isSyncActive) return;

    const hasPendingCnpj = clients.some(
      (client) =>
        client.documentType === "CNPJ" && client.status === "PENDENTE",
    );

    if (!hasPendingCnpj) {
      setIsSyncActive(false);
    }
  }, [clients, isSyncActive]);

  function handleEdit(client: Client) {
    setSelectedClient(client);
    setFormOpen(true);
  }

  function handleDelete(client: Client) {
    setSelectedClient(client);
    setDeleteOpen(true);
  }

  function handleCreate() {
    setSelectedClient(null);
    setFormOpen(true);
  }

  function handleClientSaved() {
    refetch();
    setFeedback({ message: "Cliente salvo com sucesso.", error: null });
  }

  function handleClientDeleted() {
    refetch();
    setFeedback({ message: "Cliente excluido com sucesso.", error: null });
  }

  return (
    <AuthProtect>
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Monitor CNPJ</CardTitle>
                <CardDescription>
                  {user ? `Ola, ${user.name}` : "Dashboard de clientes"}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button variant="outline" onClick={handleCreate}>
                  <Plus className="size-4" />
                  Novo cliente
                </Button>
                <Button variant="outline" onClick={() => setImportOpen(true)}>
                  <Upload className="size-4" />
                  Importar planilha
                </Button>
                <SyncButton onSync={sync} isSyncing={isSyncing} />
                <Button variant="outline" onClick={logout}>
                  Sair
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <SyncAlert
                message={feedback.message ?? message}
                error={feedback.error ?? syncError}
                onClose={() => {
                  clearMessage();
                  setFeedback({ message: null, error: null });
                }}
              />
              <ClientsTable
                clients={clients}
                isLoading={isLoading}
                error={error}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ClientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        client={selectedClient}
        onSuccess={handleClientSaved}
      />

      <ImportClientsDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onSuccess={(importMessage) => {
          refetch();
          setFeedback({ message: importMessage, error: null });
        }}
        onError={(importError) =>
          setFeedback({ message: null, error: importError })
        }
      />

      <DeleteClientDialog
        client={selectedClient}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={handleClientDeleted}
        onError={(deleteError) =>
          setFeedback({ message: null, error: deleteError })
        }
      />
    </AuthProtect>
  );
}
