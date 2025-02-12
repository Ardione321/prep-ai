// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <NextThemeProvider {...themeProps}>
        <SessionProvider>{children}</SessionProvider>
      </NextThemeProvider>
    </HeroUIProvider>
  );
}
