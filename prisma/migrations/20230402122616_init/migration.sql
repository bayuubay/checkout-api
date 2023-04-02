/*
  Warnings:

  - A unique constraint covering the columns `[order_id,promotion_id]` on the table `OrderPromotion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderPromotion_order_id_promotion_id_key" ON "OrderPromotion"("order_id", "promotion_id");
