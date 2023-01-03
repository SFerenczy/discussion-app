/*
  Warnings:

  - You are about to drop the column `text` on the `Discussion` table. All the data in the column will be lost.
  - Added the required column `viewpoint` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Discussion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "viewpoint" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "questionId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "Discussion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Discussion_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Discussion" ("createdAt", "creatorId", "id", "questionId", "updatedAt") SELECT "createdAt", "creatorId", "id", "questionId", "updatedAt" FROM "Discussion";
DROP TABLE "Discussion";
ALTER TABLE "new_Discussion" RENAME TO "Discussion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
