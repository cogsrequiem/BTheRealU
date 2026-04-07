-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon_url" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyGoal" (
    "id" TEXT NOT NULL,
    "id_goal" TEXT NOT NULL,
    "id_date" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "mood" TEXT,
    "notes" TEXT,

    CONSTRAINT "DailyGoal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyGoal" ADD CONSTRAINT "DailyGoal_id_goal_fkey" FOREIGN KEY ("id_goal") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
