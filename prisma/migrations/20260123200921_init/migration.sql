-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "usageIntent" TEXT NOT NULL,
    "budgetBand" TEXT,
    "timeline" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new'
);
