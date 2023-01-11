/*
  Warnings:

  - Added the required column `isUpVote` to the `ArgumentVote` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArgumentVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vote" INTEGER NOT NULL,
    "isUpVote" BOOLEAN NOT NULL,
    "argumentId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    CONSTRAINT "ArgumentVote_argumentId_fkey" FOREIGN KEY ("argumentId") REFERENCES "Argument" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArgumentVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ArgumentVote" ("argumentId", "id", "vote", "voterId") SELECT "argumentId", "id", "vote", "voterId" FROM "ArgumentVote";
DROP TABLE "ArgumentVote";
ALTER TABLE "new_ArgumentVote" RENAME TO "ArgumentVote";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
