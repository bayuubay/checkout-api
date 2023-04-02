-- CreateTable
CREATE TABLE "OrderPromotion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" INTEGER NOT NULL,
    "promotion_id" INTEGER NOT NULL,
    CONSTRAINT "OrderPromotion_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderPromotion_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
