import { PrismaClient } from '@prisma/client';

// 이 코드는 PrismaClient 인스턴스가 불필요하게
// 많이 생성되는 것을 방지하여 DB 연결을 효율적으로 관리합니다.

declare global {
  // allow global 'var' declarations
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    // (선택) DB 쿼리를 로그로 보고 싶다면 아래 주석을 해제하세요
    // log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;