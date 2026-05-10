CREATE TABLE IF NOT EXISTS "kanakademi_test_results" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "profile" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kanakademi_test_results_pkey" PRIMARY KEY ("id")
);
