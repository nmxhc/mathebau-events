-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EventInputField" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "eventId" TEXT NOT NULL,
    "inputFieldId" TEXT NOT NULL,

    PRIMARY KEY ("eventId", "inputFieldId"),
    CONSTRAINT "EventInputField_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventInputField_inputFieldId_fkey" FOREIGN KEY ("inputFieldId") REFERENCES "InputField" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EventInputField" ("eventId", "id", "inputFieldId") SELECT "eventId", "id", "inputFieldId" FROM "EventInputField";
DROP TABLE "EventInputField";
ALTER TABLE "new_EventInputField" RENAME TO "EventInputField";
CREATE UNIQUE INDEX "EventInputField_id_key" ON "EventInputField"("id");
CREATE TABLE "new_InputField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "adminOnly" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "typeId" TEXT NOT NULL,
    CONSTRAINT "InputField_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "InputFieldType" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InputField" ("adminOnly", "id", "name", "required", "typeId") SELECT "adminOnly", "id", "name", "required", "typeId" FROM "InputField";
DROP TABLE "InputField";
ALTER TABLE "new_InputField" RENAME TO "InputField";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
