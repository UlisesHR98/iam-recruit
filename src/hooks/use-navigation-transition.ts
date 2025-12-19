"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

type NavigateOptions = {
  replace?: boolean;
};

export function useNavigationTransition() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (href: string, options?: NavigateOptions) => {
    startTransition(() => {
      if (options?.replace) {
        router.replace(href);
      } else {
        router.push(href);
      }
    });
  };

  return {
    navigate,
    isPending,
  };
}
