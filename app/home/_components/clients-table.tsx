"use client";

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
import { PaginationEllipsis } from "@/components/ui/pagination";
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
import { useClientsTable } from "../_hook/use-clients-table";
import { formatDocument } from "../_utils/format-document";
import { StatusBadge } from "./status-badge";

const COMPANY_ICONS = [Building2, Factory, ShoppingCart];

function getVisiblePages(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);
  return pages;
}

type ClientsTableProps = {
  refreshToken?: number;
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
  refreshToken,
  onEdit,
  onDelete,
}: ClientsTableProps) {
  const {
    clients,
    pagination,
    isLoading,
    error,
    search,
    setSearch,
    setPage,
  } = useClientsTable({ refreshToken });

  const { page: currentPage, total, totalPages, pageSize } = pagination;
  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  if (isLoading && clients.length === 0) {
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

  if (error && clients.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

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
              onChange={(e) => setSearch(e.target.value)}
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
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={4} className="py-4">
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : clients.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                Nenhum CNPJ encontrado.
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client, index) => {
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
          {total === 0
            ? "Nenhum resultado"
            : `Mostrando ${startItem.toLocaleString("pt-BR")}–${endItem.toLocaleString("pt-BR")} de ${total.toLocaleString("pt-BR")} resultados`}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              aria-label="Página anterior"
            >
              <ChevronLeft className="size-4" />
            </Button>
            {visiblePages.map((pageNum, index) =>
              pageNum === "ellipsis" ? (
                <PaginationEllipsis key={`ellipsis-${index}`} />
              ) : (
                <Button
                  key={pageNum}
                  variant="ghost"
                  size="icon-sm"
                  disabled={isLoading}
                  onClick={() => setPage(pageNum)}
                  aria-label={`Página ${pageNum}`}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                  className={cn(
                    "size-8 rounded-full text-sm",
                    currentPage === pageNum &&
                      "bg-foreground text-background hover:bg-foreground/90 hover:text-background",
                  )}
                >
                  {pageNum}
                </Button>
              ),
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              aria-label="Próxima página"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
