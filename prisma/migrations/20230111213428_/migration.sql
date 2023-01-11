/*
  Warnings:

  - You are about to drop the `ContraArgumentVote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProArgumentVote` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[argumentId,voterId]` on the table `ArgumentDownvote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[argumentId,voterId]` on the table `ArgumentUpvote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ContraArgumentVote";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProArgumentVote";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ArgumentSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "href" TEXT NOT NULL,
    "argumentId" TEXT NOT NULL,
    CONSTRAINT "ArgumentSource_argumentId_fkey" FOREIGN KEY ("argumentId") REFERENCES "Argument" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ArgumentDownvote_argumentId_voterId_key" ON "ArgumentDownvote"("argumentId", "voterId");

-- CreateIndex
CREATE UNIQUE INDEX "ArgumentUpvote_argumentId_voterId_key" ON "ArgumentUpvote"("argumentId", "voterId");
