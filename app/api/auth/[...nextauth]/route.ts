import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth";

let _handler: any = null;

function getHandler() {
  if (!_handler) {
    console.log('🔥 Creating NextAuth handler for the first time');
    _handler = NextAuth(getAuthOptions());
  }
  return _handler;
}

export const GET = async (req: any, ctx: any) => {
  return getHandler()(req, ctx);
};

export const POST = async (req: any, ctx: any) => {
  return getHandler()(req, ctx);
};
