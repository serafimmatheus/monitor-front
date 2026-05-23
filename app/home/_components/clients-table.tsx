"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Client } from "../_api/clients.api";
import { formatDocument } from "../_utils/format-document";
import { StatusBadge } from "./status-badge";

type ClientsTableProps = {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
};

export function ClientsTable({
  clients,
  isLoading,
  error,
  onEdit,
  onDelete,
}: ClientsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>CNPJ / CPF</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]">Acoes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>
              {formatDocument(client.document, client.documentType)}
            </TableCell>
            <TableCell>
              <StatusBadge status={client.status} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(client)}
                  aria-label={`Editar ${client.name}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(client)}
                  aria-label={`Excluir ${client.name}`}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
