-- CreateTable
CREATE TABLE "Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cloudflare_email" TEXT NOT NULL,
    "cloudflare_api_token" TEXT NOT NULL,
    "zone_name" TEXT NOT NULL,
    "ip_address" TEXT,
    "frequency" INTEGER NOT NULL DEFAULT 60
);

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_cloudflare_email_key" ON "Configuration"("cloudflare_email");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_cloudflare_api_token_key" ON "Configuration"("cloudflare_api_token");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_zone_name_key" ON "Configuration"("zone_name");
