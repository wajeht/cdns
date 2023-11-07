-- CreateTable
CREATE TABLE "Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cloudflare_email" TEXT NOT NULL,
    "cloudflare_api_token" TEXT NOT NULL,
    "zone_name" TEXT NOT NULL,
    "dns_record" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_cloudflare_email_key" ON "Configuration"("cloudflare_email");
