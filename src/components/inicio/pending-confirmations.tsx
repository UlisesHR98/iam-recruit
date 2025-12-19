"use client";

import { useState } from "react";
import {
  ExternalLink,
  Mail,
  CheckCircle2,
  Send,
  Loader2,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useForwardingConfirmations } from "@/hooks/use-forwarding-confirmations";
import { useEmailForwardingStatus } from "@/hooks/use-email-forwarding-status";
import { Loading } from "@/components/ui/loading";
import { formatUserDateTime } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import type { ForwardingConfirmation } from "@/lib/types";
import { cn } from "@/lib/utils";

function ConfirmationCard({
  confirmation,
  onRefresh,
}: {
  confirmation: ForwardingConfirmation;
  onRefresh: () => void;
}) {
  const [isTesting, setIsTesting] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const {
    status: forwardingStatus,
    isLoading: isLoadingStatus,
    mutate,
  } = useEmailForwardingStatus(confirmation.job_id || null);

  const handleTestForwarding = async () => {
    if (!confirmation.job_id) return;

    setIsTesting(true);
    try {
      const response = await fetch(
        `/api/jobs/${confirmation.job_id}/email-forwarding/test`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            source_email: "dev.ulises@iamex.io",
          }),
        }
      );

      if (response.ok) {
        toast.success(
          "Correo de prueba enviado. Actualizando en 10 segundos..."
        );
        setTimeout(() => {
          mutate();
          onRefresh();
        }, 10000);
      } else {
        const data = await response.json();
        toast.error(data.message || "Error al enviar el correo de prueba");
      }
    } catch (error) {
      toast.error("Error al procesar la solicitud");
    } finally {
      setIsTesting(false);
    }
  };

  const isForwardingVerified = !!confirmation.forwarding_verified;
  const isPending = !confirmation.confirmed_at && !isForwardingVerified;
  const isConfirmed = !!confirmation.confirmed_at;
  const isVerified =
    forwardingStatus?.status === "verified" || isForwardingVerified;

  if (!confirmation.job) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-card overflow-hidden transition-all duration-200",
        isPending &&
          "hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-700",
        isForwardingVerified &&
          "hover:shadow-lg hover:border-green-300 dark:hover:border-green-700"
      )}
    >
      {/* Status indicator bar */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1",
          isPending && "bg-linear-to-r from-orange-400 to-amber-400",
          isForwardingVerified && "bg-linear-to-r from-green-400 to-emerald-400"
        )}
      />

      <div className="p-5 pt-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={cn(
              "shrink-0 rounded-xl p-3 transition-colors",
              isPending
                ? "bg-orange-50 dark:bg-orange-950/30 text-orange-500"
                : "bg-green-50 dark:bg-green-950/30 text-green-500"
            )}
          >
            {isPending ? (
              <Mail className="size-5" />
            ) : (
              <CheckCircle2 className="size-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base text-foreground leading-tight mb-1.5 line-clamp-2">
              {confirmation.job.role}
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className="text-xs font-normal capitalize"
              >
                {confirmation.provider}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatUserDateTime(confirmation.received_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Status message */}
        <div
          className={cn(
            "rounded-lg p-3 mb-4",
            isPending
              ? "bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30"
              : "bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30"
          )}
        >
          {isForwardingVerified ? (
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Verificado correctamente
                </p>
                {confirmation.forwarding_verified && (
                  <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-0.5">
                    {formatUserDateTime(confirmation.forwarding_verified)}
                  </p>
                )}
              </div>
            </div>
          ) : isConfirmed ? (
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Confirmado exitosamente
                </p>
                <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-0.5">
                  {formatUserDateTime(confirmation.confirmed_at!)}
                </p>
              </div>
            </div>
          ) : isVerified && !isLoadingStatus ? (
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-green-500 mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                El reenvío está activo y verificado
              </p>
            </div>
          ) : isPending ? (
            <div className="flex items-start gap-2">
              <Inbox className="size-4 text-orange-500 mt-0.5 shrink-0" />
              <p className="text-sm text-orange-700 dark:text-orange-400">
                Requiere confirmación manual en tu proveedor de correo
              </p>
            </div>
          ) : null}
        </div>

        {/* Actions */}
        {isPending && !isLoadingStatus && (
          <div className="flex gap-2">
            <Button
              className="flex-1 gap-2"
              onClick={() =>
                window.open(confirmation.confirmation_url, "_blank")
              }
            >
              <ExternalLink className="size-4" />
              Confirmar en Gmail
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={handleTestForwarding}
              disabled={isTesting}
              title="Enviar correo de prueba"
            >
              {isTesting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function PendingConfirmations() {
  const { pendingConfirmations, isLoading, mutate } =
    useForwardingConfirmations();

  const handleRefresh = () => {
    mutate();
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-8">
        <Loading message="Cargando confirmaciones..." variant="inline" />
      </div>
    );
  }

  if (pendingConfirmations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Confirmaciones de Correo
            </h2>
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 font-semibold"
            >
              {pendingConfirmations.length}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Confirma el reenvío de correos para empezar a recibir candidatos
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pendingConfirmations.map((confirmation) => (
          <ConfirmationCard
            key={confirmation.id}
            confirmation={confirmation}
            onRefresh={handleRefresh}
          />
        ))}
      </div>
    </div>
  );
}
