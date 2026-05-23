"use client";

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
import { ClientsTable } from "./_components/clients-table";
import { SyncAlert } from "./_components/sync-alert";
import { SyncButton } from "./_components/sync-button";
import { useSync } from "./_hook/use-sync";

export default function HomePage() {
  const { user, logout } = useAuth();
  const { sync, isSyncing, message, error, clearMessage } = useSync();

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
              <div className="flex items-center gap-2">
                <SyncButton onSync={sync} isSyncing={isSyncing} />
                <Button variant="outline" onClick={logout}>
                  Sair
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <SyncAlert
                message={message}
                error={error}
                onClose={clearMessage}
              />
              <ClientsTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthProtect>
  );
}
