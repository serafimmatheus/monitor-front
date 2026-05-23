"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Factory,
  Filter,
  MoreHorizontal,
  Pencil,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Client } from "../_api/clients.api";
import { formatDocument } from "../_utils/format-document";
import { StatusBadge } from "./status-badge";

const PAGE_SIZE = 10;

const COMPANY_ICONS = [Building2, Factory, ShoppingCart];

type ClientsTableProps = {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
};

function formatUpdatedAt(dateStr: string) {
  const date = new Date(dateStr);
  const formatted = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const relative = formatDistanceToNow(date, {
    addSuffix: true,
    locale: ptBR,
  });
  return { formatted, relative };
}

export function ClientsTable({
  clients,
  isLoading,
  error,
  onEdit,
  onDelete,
}: ClientsTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;

    return clients.filter((client) => {
      const document = formatDocument(client.document, client.documentType);
      return (
        client.name.toLowerCase().includes(query) ||
        document.toLowerCase().includes(query)
      );
    });
  }, [clients, search]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  const pageNumbers = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => i + 1,
  );

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Gestão de CNPJs
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar CNPJ ou Razão..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full pl-8 sm:w-64"
            />
          </div>
          <Button variant="outline" size="icon" className="size-9 shrink-0">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              CNPJ / Empresa
            </TableHead>
            <TableHead className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Última Atualização
            </TableHead>
            <TableHead className="pr-5 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedClients.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                Nenhum CNPJ encontrado.
              </TableCell>
            </TableRow>
          ) : (
            paginatedClients.map((client, index) => {
              const Icon = COMPANY_ICONS[index % COMPANY_ICONS.length];
              const { formatted, relative } = formatUpdatedAt(client.updatedAt);
              const document = formatDocument(
                client.document,
                client.documentType,
              );

              return (
                <TableRow key={client.id}>
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {document}
                        </p>
                        <p className="text-sm font-semibold uppercase">
                          {client.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={client.status} />
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-foreground">{formatted}</p>
                    <p className="text-xs text-muted-foreground">{relative}</p>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="inline-flex items-center gap-0.5">
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Mais opções"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Mostrando {paginatedClients.length} de{" "}
          {filteredClients.length.toLocaleString("pt-BR")} resultados
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant="ghost"
              size="icon-sm"
              onClick={() => setPage(pageNum)}
              className={cn(
                "size-8 rounded-full text-sm",
                currentPage === pageNum &&
                  "bg-foreground text-background hover:bg-foreground/90 hover:text-background",
              )}
            >
              {pageNum}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Próxima página"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
