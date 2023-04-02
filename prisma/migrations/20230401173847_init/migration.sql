-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "qty" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "product_sku" TEXT NOT NULL,
    "order_id" INTEGER NOT NULL,
    "order_type" TEXT NOT NULL DEFAULT 'regular',
    CONSTRAINT "OrderDetail_product_sku_fkey" FOREIGN KEY ("product_sku") REFERENCES "Product" ("sku") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderDetail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderDetail" ("id", "order_id", "price", "product_sku", "qty") SELECT "id", "order_id", "price", "product_sku", "qty" FROM "OrderDetail";
DROP TABLE "OrderDetail";
ALTER TABLE "new_OrderDetail" RENAME TO "OrderDetail";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
