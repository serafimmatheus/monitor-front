"use client";

import { useState } from "react";
import { Bell, Upload } from "lucide-react";
import { AuthProtect } from "@/components/auth-protect";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { ClientFormDialog } from "./_components/client-form-dialog";
import { ClientsTable } from "./_components/clients-table";
import { DashboardFooter } from "./_components/dashboard-footer";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { DeleteClientDialog } from "./_components/delete-client-dialog";
import { ImportClientsDialog } from "./_components/import-clients-dialog";
import { PlanInfoCard } from "./_components/plan-info-card";
import { StatsCards } from "./_components/stats-cards";
import { SyncAlert } from "./_components/sync-alert";
import { SyncButton } from "./_components/sync-button";
import { SyncProgressCard } from "./_components/sync-progress-card";
import type { Client } from "./_api/clients.api";
import { useClients } from "./_hook/use-clients";
import { usePlanLimits } from "./_hook/use-plan-limits";
import { useSync } from "./_hook/use-sync";

export default function HomePage() {
  const { logout } = useAuth();
  const { summary, hasPendingSync, refetch } = useClients();
  const { planInfo, isLoading: isPlanLoading, refetch: refetchPlan } =
    usePlanLimits();
  const { sync, isSyncing, message, error: syncError, clearMessage } = useSync(
    () => refetch(),
    () => refetchPlan(),
  );

  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [tableRefreshToken, setTableRefreshToken] = useState(0);
  const [feedback, setFeedback] = useState<{
    message: string | null;
    error: string | null;
  }>({ message: null, error: null });

  function getSyncDisabledReason() {
    if (!planInfo) {
      return undefined;
    }

    if (planInfo.maxSyncsPerMonth === 0) {
      return "Plano gratuito nao permite sincronizacao. Faca upgrade para Starter ou Pro.";
    }

    if (!planInfo.canSync) {
      return `Limite de ${planInfo.maxSyncsPerMonth} sincronizacoes por mes atingido.`;
    }

    return undefined;
  }

  const canSync = planInfo?.canSync ?? false;
  const allowImport = planInfo?.allowImport ?? false;
  const syncDisabledReason = getSyncDisabledReason();
  const importDisabledReason = allowImport
    ? undefined
    : "Importacao disponivel apenas no plano Pro (R$ 100/mes).";

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

  function refreshClientsData() {
    refetch();
    setTableRefreshToken((current) => current + 1);
  }

  function handleClientSaved() {
    refreshClientsData();
    setFeedback({ message: "Cliente salvo com sucesso.", error: null });
  }

  function handleClientDeleted() {
    refreshClientsData();
    setFeedback({ message: "Cliente excluido com sucesso.", error: null });
  }

  return (
    <AuthProtect>
      <div className="flex min-h-screen bg-[#f8f9fa]">
        <DashboardSidebar
          onNewMonitoring={handleCreate}
          onLogout={logout}
        />

        <div className="flex min-h-screen flex-1 flex-col overflow-auto">
          <main className="flex flex-1 flex-col gap-6 p-8">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Visão Geral
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bem-vindo ao centro de operações de monitoramento.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 text-muted-foreground"
                  aria-label="Notificações"
                >
                  <Bell className="size-5" />
                </Button>
                <SyncButton
                  onSync={sync}
                  isSyncing={isSyncing}
                  isSyncActive={hasPendingSync}
                  canSync={canSync}
                  disabledReason={syncDisabledReason}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9"
                  onClick={() => setImportOpen(true)}
                  disabled={!allowImport}
                  aria-label="Importar planilha"
                  title={importDisabledReason ?? "Importar planilha"}
                >
                  <Upload className="size-4" />
                </Button>
              </div>
            </header>

            <SyncAlert
              message={feedback.message ?? message}
              error={feedback.error ?? syncError}
              onClose={() => {
                clearMessage();
                setFeedback({ message: null, error: null });
              }}
            />

            <StatsCards summary={summary} />

            <PlanInfoCard planInfo={planInfo} isLoading={isPlanLoading} />

            <SyncProgressCard
              summary={summary}
              isSyncing={isSyncing}
              isSyncActive={hasPendingSync}
            />

            <ClientsTable
              refreshToken={tableRefreshToken}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <DashboardFooter />
          </main>
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
          refreshClientsData();
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
