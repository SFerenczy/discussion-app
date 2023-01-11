/*
  Warnings:

  - You are about to drop the `KontraArgumentVote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "KontraArgumentVote";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ContraArgumentVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vote" INTEGER NOT NULL,
    "argumentId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    CONSTRAINT "ContraArgumentVote_argumentId_fkey" FOREIGN KEY ("argumentId") REFERENCES "Argument" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContraArgumentVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
