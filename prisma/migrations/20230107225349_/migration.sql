-- CreateTable
CREATE TABLE "ArgumentUpvote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vote" INTEGER NOT NULL,
    "argumentId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    CONSTRAINT "ArgumentUpvote_argumentId_fkey" FOREIGN KEY ("argumentId") REFERENCES "Argument" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArgumentUpvote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArgumentDownvote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vote" INTEGER NOT NULL,
    "argumentId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    CONSTRAINT "ArgumentDownvote_argumentId_fkey" FOREIGN KEY ("argumentId") REFERENCES "Argument" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ArgumentDownvote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
