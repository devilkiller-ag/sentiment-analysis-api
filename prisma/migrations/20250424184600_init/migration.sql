-- CreateTable
CREATE TABLE "Sentence" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "sentiment" TEXT,
    "webhook" TEXT,

    CONSTRAINT "Sentence_pkey" PRIMARY KEY ("id")
);
