/*
  Warnings:

  - You are about to drop the column `vote` on the `ArgumentDownvote` table. All the data in the column will be lost.
  - You are about to drop the column `vote` on the `ArgumentUpvote` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArgumentDownvote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "argumentId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    CONSTRAINT "ArgumentDownvote_argumentId_fkey" FOREIGN KEY ("argumentId") REFERENCES "Argument" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArgumentDownvote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ArgumentDownvote" ("argumentId", "id", "voterId") SELECT "argumentId", "id", "voterId" FROM "ArgumentDownvote";
DROP TABLE "ArgumentDownvote";
ALTER TABLE "new_ArgumentDownvote" RENAME TO "ArgumentDownvote";
CREATE TABLE "new_ArgumentUpvote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "argumentId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    CONSTRAINT "ArgumentUpvote_argumentId_fkey" FOREIGN KEY ("argumentId") REFERENCES "Argument" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArgumentUpvote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ArgumentUpvote" ("argumentId", "id", "voterId") SELECT "argumentId", "id", "voterId" FROM "ArgumentUpvote";
DROP TABLE "ArgumentUpvote";
ALTER TABLE "new_ArgumentUpvote" RENAME TO "ArgumentUpvote";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
