"use client";

// NextAuth가 제공하는 공식 세션 제공자입니다.
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import React from "react";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
}