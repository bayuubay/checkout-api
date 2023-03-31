/*
  Warnings:

  - Added the required column `percentage` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_id` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Type" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Promotion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_sku" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type_id" INTEGER NOT NULL,
    "percentage" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "bonus_item_sku" TEXT,
    CONSTRAINT "Promotion_item_sku_fkey" FOREIGN KEY ("item_sku") REFERENCES "Product" ("sku") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Promotion_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Promotion_bonus_item_sku_fkey" FOREIGN KEY ("bonus_item_sku") REFERENCES "Product" ("sku") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Promotion" ("description", "id", "item_sku") SELECT "description", "id", "item_sku" FROM "Promotion";
DROP TABLE "Promotion";
ALTER TABLE "new_Promotion" RENAME TO "Promotion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
