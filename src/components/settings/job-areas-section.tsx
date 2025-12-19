"use client";

import { useState } from "react";
import { useJobAreas } from "@/hooks/use-job-areas";
import { useJobAreaMutations } from "@/hooks/use-job-area-mutations";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import type { JobArea } from "@/lib/types";

interface JobAreaFormData {
  key: string;
  name: string;
  color: string;
  order: number;
  is_active: boolean;
}

const DEFAULT_FORM_DATA: JobAreaFormData = {
  key: "",
  name: "",
  color: "#3b82f6",
  order: 0,
  is_active: true,
};

export function JobAreasSection() {
  const { areas, isLoading, mutate: mutateAreas } = useJobAreas();
  const { createOrUpdate, deleteArea, isSubmitting } = useJobAreaMutations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<JobArea | null>(null);
  const [editingArea, setEditingArea] = useState<JobArea | null>(null);
  const [formData, setFormData] = useState<JobAreaFormData>(DEFAULT_FORM_DATA);

  const handleOpenDialog = (area?: JobArea) => {
    if (area) {
      setEditingArea(area);
      setFormData({
        key: area.key,
        name: area.name,
        color: area.color,
        order: area.order,
        is_active: area.is_active,
      });
    } else {
      setEditingArea(null);
      setFormData({
        ...DEFAULT_FORM_DATA,
        order: areas.length,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingArea(null);
    setFormData(DEFAULT_FORM_DATA);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createOrUpdate(formData, editingArea?.id);
    if (result) {
      await mutateAreas();
      handleCloseDialog();
    }
  };

  const handleOpenDeleteDialog = (area: JobArea) => {
    setAreaToDelete(area);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!areaToDelete) return;

    const success = await deleteArea(areaToDelete.id);
    if (success) {
      await mutateAreas();
      setIsDeleteDialogOpen(false);
      setAreaToDelete(null);
    }
  };

  if (isLoading) {
    return <Loading message="Cargando áreas de trabajo..." variant="inline" />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Áreas de Trabajo</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona las áreas de trabajo disponibles para tus vacantes
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="size-4" />
          Nueva Área
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Clave</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No hay áreas de trabajo. Crea una nueva para comenzar.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              areas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="font-medium">{area.name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {area.key}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="size-6 rounded border"
                        style={{ backgroundColor: area.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {area.color}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{area.order}</TableCell>
                  <TableCell>
                    <Badge
                      variant={area.is_active ? "default" : "secondary"}
                    >
                      {area.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(area)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDeleteDialog(area)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingArea ? "Editar Área" : "Nueva Área"}
            </DialogTitle>
            <DialogDescription>
              {editingArea
                ? "Modifica los datos del área de trabajo"
                : "Completa los datos para crear una nueva área de trabajo"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nombre *</FieldLabel>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ingeniería"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="key">Clave *</FieldLabel>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      key: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  placeholder="engineering"
                  required
                  pattern="[a-z0-9-]+"
                  title="Solo letras minúsculas, números y guiones"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Solo letras minúsculas, números y guiones
                </p>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="color">Color *</FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="h-10 w-20 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      placeholder="#3b82f6"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      className="flex-1"
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="order">Orden *</FieldLabel>
                  <Input
                    id="order"
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </Field>
              </div>

              <Field>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_active: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  <FieldLabel htmlFor="is_active" className="cursor-pointer">
                    Área activa
                  </FieldLabel>
                </div>
              </Field>
            </FieldGroup>

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
              >
                <X className="size-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="size-4 mr-2" />
                    {editingArea ? "Actualizar" : "Crear"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar área de trabajo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El área{" "}
              <strong>{areaToDelete?.name}</strong> será eliminada
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAreaToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

