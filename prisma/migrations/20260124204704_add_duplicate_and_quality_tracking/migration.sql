-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "usageIntent" TEXT NOT NULL,
    "budget" TEXT,
    "timeline" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "isDuplicate" BOOLEAN NOT NULL DEFAULT false,
    "duplicateCount" INTEGER NOT NULL DEFAULT 0,
    "originalLeadId" TEXT,
    "lastSubmittedAt" DATETIME,
    "qualityScore" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Lead" ("budget", "city", "consent", "createdAt", "email", "id", "name", "notes", "phone", "serviceType", "status", "timeline", "usageIntent") SELECT "budget", "city", "consent", "createdAt", "email", "id", "name", "notes", "phone", "serviceType", "status", "timeline", "usageIntent" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
