/*
  Warnings:

  - You are about to drop the column `promotion_id` on the `Order` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_price" REAL NOT NULL,
    "status_id" INTEGER,
    CONSTRAINT "Order_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Status" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("id", "status_id", "total_price") SELECT "id", "status_id", "total_price" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
