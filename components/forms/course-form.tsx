"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import {
  createCourse,
  fetchCourseMeta,
  updateCourse,
} from "@/lib/data/udemy-actions";
import type { UdemyCourse } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  title: z.string().min(2, "Informe o título do curso."),
  instructor: z.string().optional(),
  url: z.string().url("URL inválida.").optional().or(z.literal("")),
  image_url: z.string().url("URL de imagem inválida.").optional().or(z.literal("")),
  category: z.string().optional(),
  level: z.enum(["basico", "intermediario", "avancado"]),
  duration: z.string().optional(),
  status: z.enum(["nao_iniciado", "em_andamento", "concluido"]),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  title: "",
  instructor: "",
  url: "",
  image_url: "",
  category: "",
  level: "basico",
  duration: "",
  status: "nao_iniciado",
  description: "",
};

const selectCls =
  "flex h-10 w-full rounded-md border border-input bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function CourseForm({
  open,
  onOpenChange,
  course,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  course?: UdemyCourse | null;
  onSaved: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchMsg, setFetchMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) {
      setServerError(null);
      setFetchMsg(null);
      reset(
        course
          ? {
              title: course.title,
              instructor: course.instructor ?? "",
              url: course.url ?? "",
              image_url: course.image_url ?? "",
              category: course.category ?? "",
              level: course.level,
              duration: course.duration ?? "",
              status: course.status,
              description: course.description ?? "",
            }
          : EMPTY,
      );
    }
  }, [open, course, reset]);

  const imageUrl = watch("image_url");

  const handleFetch = async () => {
    const url = watch("url");
    if (!url) {
      setFetchMsg("Cole a URL do curso primeiro.");
      return;
    }
    setFetching(true);
    setFetchMsg(null);
    const meta = await fetchCourseMeta(url);
    setFetching(false);
    if (meta.error) {
      setFetchMsg(meta.error);
      return;
    }
    if (meta.title) setValue("title", meta.title, { shouldValidate: true });
    if (meta.image_url) setValue("image_url", meta.image_url);
    if (meta.description) setValue("description", meta.description);
    if (meta.instructor && !watch("instructor"))
      setValue("instructor", meta.instructor);
    setFetchMsg("Informações importadas! Revise e salve.");
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const payload = { ...values };
    const res = course
      ? await updateCourse(course.id, payload)
      : await createCourse(payload);
    if (res?.error) {
      setServerError(res.error);
      return;
    }
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {course ? "Editar curso" : "Adicionar curso da Udemy"}
          </DialogTitle>
          <DialogDescription>
            Cole a URL do curso e importe os dados automaticamente, ou preencha
            manualmente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* URL + importar */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">URL do curso</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://www.udemy.com/course/..."
                {...register("url")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleFetch}
                disabled={fetching}
                className="shrink-0"
              >
                {fetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Importar
              </Button>
            </div>
            {errors.url && (
              <p className="text-xs text-danger">{errors.url.message}</p>
            )}
            {fetchMsg && (
              <p className="text-xs text-text-secondary">{fetchMsg}</p>
            )}
          </div>

          {/* Preview do banner */}
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Banner do curso"
              className="h-36 w-full rounded-lg border border-border object-cover"
            />
          ) : null}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Título *</label>
            <Input placeholder="Nome do curso" {...register("title")} />
            {errors.title && (
              <p className="text-xs text-danger">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Instrutor</label>
              <Input placeholder="Nome do instrutor" {...register("instructor")} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Categoria</label>
              <Input placeholder="Ex.: Backend, Dados..." {...register("category")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">URL do banner (imagem)</label>
            <Input placeholder="https://..." {...register("image_url")} />
            {errors.image_url && (
              <p className="text-xs text-danger">{errors.image_url.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nível</label>
              <select className={selectCls} {...register("level")}>
                <option value="basico">Básico</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <select className={selectCls} {...register("status")}>
                <option value="nao_iniciado">Não iniciado</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Duração</label>
              <Input placeholder="Ex.: 12h" {...register("duration")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              placeholder="Sobre o que é o curso..."
              {...register("description")}
            />
          </div>

          {serverError && (
            <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {serverError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {course ? "Salvar alterações" : "Adicionar curso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
