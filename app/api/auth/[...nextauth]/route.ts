export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { getAuthOptions } from "@/lib/auth";

// 런타임에만 핸들러 생성
export async function GET(req: Request, context: any) {
  const handler = NextAuth(getAuthOptions());
  return handler(req, context);
}

export async function POST(req: Request, context: any) {
  const handler = NextAuth(getAuthOptions());
  return handler(req, context);
}
