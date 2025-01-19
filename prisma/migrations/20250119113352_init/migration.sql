/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Account` table. All the data in the column will be lost.
  - The primary key for the `Authenticator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `credentialBackedUp` on the `Authenticator` table. All the data in the column will be lost.
  - You are about to drop the column `credentialDeviceType` on the `Authenticator` table. All the data in the column will be lost.
  - You are about to drop the column `credentialID` on the `Authenticator` table. All the data in the column will be lost.
  - You are about to drop the column `credentialPublicKey` on the `Authenticator` table. All the data in the column will be lost.
  - You are about to drop the column `providerAccountId` on the `Authenticator` table. All the data in the column will be lost.
  - You are about to drop the column `transports` on the `Authenticator` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `OnboardingStatus` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `OnboardingStatus` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[credentialId]` on the table `Authenticator` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Account` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `credentialId` to the `Authenticator` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Authenticator` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `publicKey` to the `Authenticator` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Session` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "OnboardingStatus" DROP CONSTRAINT "OnboardingStatus_userId_fkey";

-- DropIndex
DROP INDEX "Authenticator_credentialID_key";

-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Authenticator" DROP CONSTRAINT "Authenticator_pkey",
DROP COLUMN "credentialBackedUp",
DROP COLUMN "credentialDeviceType",
DROP COLUMN "credentialID",
DROP COLUMN "credentialPublicKey",
DROP COLUMN "providerAccountId",
DROP COLUMN "transports",
ADD COLUMN     "credentialId" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "publicKey" BYTEA NOT NULL,
ALTER COLUMN "counter" SET DATA TYPE BIGINT,
ADD CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "OnboardingStatus" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountType" TEXT NOT NULL DEFAULT 'parent',
ADD COLUMN     "familyCode" TEXT,
ADD COLUMN     "password" TEXT;

-- DropTable
DROP TABLE "VerificationToken";

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialId_key" ON "Authenticator"("credentialId");

-- AddForeignKey
ALTER TABLE "OnboardingStatus" ADD CONSTRAINT "OnboardingStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
