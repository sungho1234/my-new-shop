import type { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 환경 변수 디버깅 - Force redeploy
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NAVER_CLIENT_ID exists:', !!process.env.NAVER_CLIENT_ID);
console.log('NAVER_CLIENT_SECRET exists:', !!process.env.NAVER_CLIENT_SECRET);
console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET
      ? [
          KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET
      ? [
          NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID,
            clientSecret: process.env.NAVER_CLIENT_SECRET,
            profile(profile) {
              return {
                id: profile.response.id,
                name: profile.response.name,
                email: profile.response.email,
                image: profile.response.profile_image,
              };
            },
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.email) return false;

      try {
        const provider = account.provider;
        const providerId = account.providerAccountId;

        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          // 새 사용자 생성
          const userData: any = {
            email: user.email,
            name: user.name || "",
            image: user.image,
          };

          if (provider === "kakao") {
            userData.kakaoId = providerId;
          } else if (provider === "naver") {
            userData.naverId = providerId;
          } else if (provider === "google") {
            userData.googleId = providerId;
          }

          dbUser = await prisma.user.create({
            data: userData,
          });
        } else {
          // 기존 사용자 업데이트 (이름, 이미지, provider ID)
          const updateData: any = {
            name: user.name || dbUser.name,
            image: user.image || dbUser.image,
          };

          // Provider ID도 업데이트 (없는 경우에만)
          if (provider === "kakao" && !dbUser.kakaoId) {
            updateData.kakaoId = providerId;
          } else if (provider === "naver" && !dbUser.naverId) {
            updateData.naverId = providerId;
          } else if (provider === "google" && !dbUser.googleId) {
            updateData.googleId = providerId;
          }

          dbUser = await prisma.user.update({
            where: { email: user.email },
            data: updateData,
          });
        }

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          include: {
            courseAccess: true,
            wishlist: true,
          },
        });

        if (dbUser) {
          // @ts-ignore - 추가 필드
          session.user.id = dbUser.id;
          session.user.name = dbUser.name;
          session.user.image = dbUser.image;
          // @ts-ignore - 추가 필드
          session.user.isProfileComplete = dbUser.isProfileComplete;
          // @ts-ignore - 추가 필드
          session.user.phone = dbUser.phone;
          // @ts-ignore - 추가 필드
          session.user.birthday = dbUser.birthday;
          // @ts-ignore - 추가 필드
          session.user.gender = dbUser.gender;
          // @ts-ignore - 추가 필드
          session.user.createdAt = dbUser.createdAt;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.SECRET,
};
