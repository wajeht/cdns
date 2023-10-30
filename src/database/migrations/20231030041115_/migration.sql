/*
  Warnings:

  - Added the required column `frequency` to the `Configuration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `record` to the `Configuration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zone` to the `Configuration` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "record" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL
);
INSERT INTO "new_Configuration" ("email", "id", "key") SELECT "email", "id", "key" FROM "Configuration";
DROP TABLE "Configuration";
ALTER TABLE "new_Configuration" RENAME TO "Configuration";
CREATE UNIQUE INDEX "Configuration_email_key" ON "Configuration"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
