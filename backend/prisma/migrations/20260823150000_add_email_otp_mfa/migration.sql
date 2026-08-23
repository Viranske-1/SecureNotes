-- AlterTable
ALTER TABLE "User"
ADD COLUMN "otpHash" TEXT,
ADD COLUMN "otpExpiresAt" TIMESTAMP(3);
