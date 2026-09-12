-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('LOSE_WEIGHT', 'MAINTAIN_WEIGHT', 'GAIN_WEIGHT', 'BUILD_MUSCLE');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- CreateEnum
CREATE TYPE "FoodSource" AS ENUM ('USDA_FDC', 'FATSECRET', 'CUSTOM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "heightCm" DECIMAL(5,2),
    "weightKg" DECIMAL(5,2),
    "activityLevel" "ActivityLevel" NOT NULL DEFAULT 'MODERATELY_ACTIVE',
    "goal" "GoalType" NOT NULL DEFAULT 'MAINTAIN_WEIGHT',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "effectiveFrom" DATE NOT NULL,
    "calorieTarget" INTEGER NOT NULL,
    "proteinTargetGrams" DECIMAL(6,2) NOT NULL,
    "carbohydrateTargetGrams" DECIMAL(6,2),
    "fatTargetGrams" DECIMAL(6,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "source" "FoodSource" NOT NULL,
    "externalId" TEXT,
    "name" TEXT NOT NULL,
    "brandName" TEXT,
    "servingSize" DECIMAL(8,2) NOT NULL,
    "servingUnit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodNutrition" (
    "id" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "caloriesPerServing" INTEGER NOT NULL,
    "proteinGrams" DECIMAL(7,2) NOT NULL,
    "carbohydrateGrams" DECIMAL(7,2),
    "fatGrams" DECIMAL(7,2),
    "fiberGrams" DECIMAL(7,2),
    "sugarGrams" DECIMAL(7,2),
    "sodiumMg" DECIMAL(8,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodNutrition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "MealType" NOT NULL,
    "name" TEXT,
    "loggedFor" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "foodId" TEXT,
    "loggedFor" DATE NOT NULL,
    "quantity" DECIMAL(8,2) NOT NULL,
    "servingSizeSnapshot" DECIMAL(8,2) NOT NULL,
    "servingUnitSnapshot" TEXT NOT NULL,
    "foodNameSnapshot" TEXT NOT NULL,
    "brandNameSnapshot" TEXT,
    "sourceSnapshot" "FoodSource" NOT NULL,
    "caloriesSnapshot" INTEGER NOT NULL,
    "proteinGramsSnapshot" DECIMAL(7,2) NOT NULL,
    "carbohydrateGramsSnapshot" DECIMAL(7,2),
    "fatGramsSnapshot" DECIMAL(7,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyNutrition" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loggedFor" DATE NOT NULL,
    "totalCalories" INTEGER NOT NULL DEFAULT 0,
    "totalProteinGrams" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "totalCarbohydrateGrams" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "totalFatGrams" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyNutrition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "NutritionGoal_userId_effectiveFrom_idx" ON "NutritionGoal"("userId", "effectiveFrom" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "NutritionGoal_userId_effectiveFrom_key" ON "NutritionGoal"("userId", "effectiveFrom");

-- CreateIndex
CREATE INDEX "Food_name_idx" ON "Food"("name");

-- CreateIndex
CREATE INDEX "Food_brandName_idx" ON "Food"("brandName");

-- CreateIndex
CREATE UNIQUE INDEX "Food_source_externalId_key" ON "Food"("source", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodNutrition_foodId_key" ON "FoodNutrition"("foodId");

-- CreateIndex
CREATE INDEX "Meal_userId_loggedFor_idx" ON "Meal"("userId", "loggedFor" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Meal_userId_loggedFor_type_key" ON "Meal"("userId", "loggedFor", "type");

-- CreateIndex
CREATE INDEX "FoodEntry_userId_loggedFor_idx" ON "FoodEntry"("userId", "loggedFor" DESC);

-- CreateIndex
CREATE INDEX "FoodEntry_mealId_idx" ON "FoodEntry"("mealId");

-- CreateIndex
CREATE INDEX "DailyNutrition_userId_loggedFor_idx" ON "DailyNutrition"("userId", "loggedFor" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "DailyNutrition_userId_loggedFor_key" ON "DailyNutrition"("userId", "loggedFor");

-- CreateIndex
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_tokenHash_key" ON "VerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "VerificationToken_userId_expiresAt_idx" ON "VerificationToken"("userId", "expiresAt");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionGoal" ADD CONSTRAINT "NutritionGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodNutrition" ADD CONSTRAINT "FoodNutrition_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodEntry" ADD CONSTRAINT "FoodEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodEntry" ADD CONSTRAINT "FoodEntry_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodEntry" ADD CONSTRAINT "FoodEntry_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyNutrition" ADD CONSTRAINT "DailyNutrition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
