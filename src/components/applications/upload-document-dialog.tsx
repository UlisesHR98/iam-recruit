"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UploadDocumentDialogProps } from "@/lib/types";

export function UploadDocumentDialog({
  open,
  onOpenChange,
}: UploadDocumentDialogProps) {
  const router = useRouter();
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { jobs, isLoading: jobsLoading } = useJobs({ status: "open" });
  const accessToken = useAuthStore((state) => state.accessToken);

  const openJobs = jobs.filter((job) => job.status === "open");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedJobId) {
      toast.error("Por favor selecciona una vacante");
      return;
    }

    if (!selectedFile) {
      toast.error("Por favor selecciona un archivo");
      return;
    }

    if (!accessToken) {
      toast.error("No estás autenticado");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("job_id", selectedJobId);
      formData.append("file", selectedFile);

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Error al subir el documento"
        );
      }

      toast.success("Documento subido exitosamente");
      onOpenChange(false);
      setSelectedJobId("");
      setSelectedFile(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al subir el documento"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subir documento</DialogTitle>
          <DialogDescription>
            Selecciona una vacante y sube el documento de la aplicación
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="job-select">Vacante</Label>
            <Select
              value={selectedJobId}
              onValueChange={setSelectedJobId}
              disabled={jobsLoading || isUploading}
            >
              <SelectTrigger id="job-select">
                <SelectValue placeholder="Selecciona una vacante" />
              </SelectTrigger>
              <SelectContent>
                {openJobs.length === 0 ? (
                  <SelectItem value="no-jobs" disabled>
                    No hay vacantes abiertas
                  </SelectItem>
                ) : (
                  openJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.role}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-input">Documento</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
                className="cursor-pointer"
              />
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading || !selectedJobId || !selectedFile}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="mr-2 size-4" />
                Subir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

