-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "signupStartDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signupEndDate" DATETIME NOT NULL,
    "participantsLimit" INTEGER,
    "cost" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Event" ("cost", "description", "endDate", "id", "location", "name", "participantsLimit", "signupEndDate", "signupStartDate", "startDate") SELECT "cost", "description", "endDate", "id", "location", "name", "participantsLimit", "signupEndDate", "signupStartDate", "startDate" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
