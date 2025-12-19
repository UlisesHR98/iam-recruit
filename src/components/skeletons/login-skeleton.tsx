import { Field, FieldGroup } from "@/components/ui/field";

export default function LoginSkeleton() {
  return (
    <form>
      <FieldGroup>
        <Field>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-9 w-full bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
          </div>
        </Field>

        <Field>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="h-9 w-full bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
          </div>
        </Field>

        <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />

        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-slate-200 dark:border-border-dark" />
          <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-4" />
          <div className="grow border-t border-slate-200 dark:border-border-dark" />
        </div>

        <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />

        <div className="mt-4 text-center space-y-2">
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
        </div>
      </FieldGroup>
    </form>
  );
}

