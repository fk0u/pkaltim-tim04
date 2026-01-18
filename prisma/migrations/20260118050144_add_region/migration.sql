-- CreateTable
CREATE TABLE "Region" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "capital" TEXT NOT NULL,
    "leader" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "population" TEXT NOT NULL,
    "density" TEXT NOT NULL,
    "districts" INTEGER NOT NULL,
    "villages" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "destinations" TEXT NOT NULL
);
