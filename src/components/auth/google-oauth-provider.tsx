"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

interface GoogleOAuthProviderWrapperProps {
  children: React.ReactNode;
  clientId: string;
}

export function GoogleOAuthProviderWrapper({
  children,
  clientId,
}: GoogleOAuthProviderWrapperProps) {
  // Si no hay clientId, aún envolvemos en el provider con un ID vacío
  // para que los componentes no fallen, pero no funcionarán
  const effectiveClientId = clientId || "placeholder-client-id";

  return (
    <GoogleOAuthProvider clientId={effectiveClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
