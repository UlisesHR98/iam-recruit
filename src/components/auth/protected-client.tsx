"use client";

import { useAuthBootstrap } from "@/hooks/use-auth-bootstrap";

export default function ProtectedClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthBootstrap();
  return <>{children}</>;
}
