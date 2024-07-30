-- CreateTable
CREATE TABLE "confirm_deletion_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "confirm_deletion_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "confirm_deletion_token_id_key" ON "confirm_deletion_token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "confirm_deletion_token_token_key" ON "confirm_deletion_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "confirm_deletion_token_userId_key" ON "confirm_deletion_token"("userId");

-- AddForeignKey
ALTER TABLE "confirm_deletion_token" ADD CONSTRAINT "confirm_deletion_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
