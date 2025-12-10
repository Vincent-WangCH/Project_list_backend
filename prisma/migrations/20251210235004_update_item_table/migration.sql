/*
  Warnings:

  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `price` on the `Item` table. All the data in the column will be lost.
  - Made the column `description` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey",
DROP COLUMN "price",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Temporary',
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerID" TEXT NOT NULL DEFAULT 'admin-1',
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DEFAULT 'item',
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT 'item description',
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Item_id_seq";

-- CreateIndex
CREATE INDEX "Item_ownerID_idx" ON "Item"("ownerID");

-- CreateIndex
CREATE INDEX "Item_date_idx" ON "Item"("date");

-- CreateIndex
CREATE INDEX "Item_category_idx" ON "Item"("category");
