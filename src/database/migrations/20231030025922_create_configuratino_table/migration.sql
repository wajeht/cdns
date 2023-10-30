-- CreateTable
CREATE TABLE "Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "key" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_email_key" ON "Configuration"("email");
