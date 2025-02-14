"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      className="p-2 rounded-full transition-all duration-300"
      radius="full"
      onPress={() => setTheme(theme === "light" ? "dark" : "light")}
      variant="light"
      color="danger"
    >
      {theme === "light" ? (
        <Icon icon="il:brightness" fontSize={22} />
      ) : (
        <Icon icon="il:moon" fontSize={22} />
      )}
    </Button>
  );
}
