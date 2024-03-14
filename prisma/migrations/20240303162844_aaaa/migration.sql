-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "isChecked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRejected" BOOLEAN NOT NULL DEFAULT false;
