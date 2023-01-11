/*
  Warnings:

  - You are about to drop the `ArgumentVote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ArgumentVote";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ProArgumentVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vote" INTEGER NOT NULL,
    "argumentId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    CONSTRAINT "ProArgumentVote_argumentId_fkey" FOREIGN KEY ("argumentId") REFERENCES "Argument" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProArgumentVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KontraArgumentVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vote" INTEGER NOT NULL,
    "argumentId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    CONSTRAINT "KontraArgumentVote_argumentId_fkey" FOREIGN KEY ("argumentId") REFERENCES "Argument" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "KontraArgumentVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
