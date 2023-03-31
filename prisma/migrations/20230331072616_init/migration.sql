/*
  Warnings:

  - Added the required column `min_qty` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Promotion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_sku" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type_id" INTEGER NOT NULL,
    "percentage" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "min_qty" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "bonus_item_sku" TEXT,
    CONSTRAINT "Promotion_item_sku_fkey" FOREIGN KEY ("item_sku") REFERENCES "Product" ("sku") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Promotion_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Promotion_bonus_item_sku_fkey" FOREIGN KEY ("bonus_item_sku") REFERENCES "Product" ("sku") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Promotion" ("bonus_item_sku", "description", "id", "item_sku", "percentage", "price", "quantity", "type_id") SELECT "bonus_item_sku", "description", "id", "item_sku", "percentage", "price", "quantity", "type_id" FROM "Promotion";
DROP TABLE "Promotion";
ALTER TABLE "new_Promotion" RENAME TO "Promotion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
