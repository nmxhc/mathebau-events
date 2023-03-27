/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Password` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Note";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Password";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdminPassword" (
    "hash" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    CONSTRAINT "AdminPassword_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailValidationToken" TEXT NOT NULL,
    "validatedEmail" BOOLEAN NOT NULL DEFAULT false,
    "dedicatedToOneSignup" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "EventAdmin" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,

    PRIMARY KEY ("eventId", "adminId"),
    CONSTRAINT "EventAdmin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventAdmin_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Signup" (
    "id" TEXT NOT NULL,
    "signupTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "eventId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    PRIMARY KEY ("participantId", "eventId"),
    CONSTRAINT "Signup_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Signup_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "signupStartDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signupEndDate" DATETIME NOT NULL,
    "participantsLimit" INTEGER,
    "cost" TEXT
);

-- CreateTable
CREATE TABLE "EventInputField" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "inputFieldId" TEXT NOT NULL,

    PRIMARY KEY ("eventId", "inputFieldId"),
    CONSTRAINT "EventInputField_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventInputField_inputFieldId_fkey" FOREIGN KEY ("inputFieldId") REFERENCES "InputField" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SignupEventInputValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "signupId" TEXT NOT NULL,
    "eventInputFieldId" TEXT NOT NULL,

    PRIMARY KEY ("signupId", "eventInputFieldId"),
    CONSTRAINT "SignupEventInputValue_signupId_fkey" FOREIGN KEY ("signupId") REFERENCES "Signup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SignupEventInputValue_eventInputFieldId_fkey" FOREIGN KEY ("eventInputFieldId") REFERENCES "EventInputField" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InputField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "adminOnly" BOOLEAN NOT NULL DEFAULT false,
    "typeId" TEXT NOT NULL,
    CONSTRAINT "InputField_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "InputFieldType" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InputFieldType" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "inputFieldId" TEXT NOT NULL,
    CONSTRAINT "Option_inputFieldId_fkey" FOREIGN KEY ("inputFieldId") REFERENCES "InputField" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminPassword_adminId_key" ON "AdminPassword"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_emailValidationToken_key" ON "Participant"("emailValidationToken");

-- CreateIndex
CREATE UNIQUE INDEX "EventAdmin_id_key" ON "EventAdmin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Signup_id_key" ON "Signup"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EventInputField_id_key" ON "EventInputField"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SignupEventInputValue_id_key" ON "SignupEventInputValue"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Option_name_inputFieldId_key" ON "Option"("name", "inputFieldId");
