CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "booking" (
	"id" text PRIMARY KEY NOT NULL,
	"eventId" text NOT NULL,
	"userId" text NOT NULL,
	"status" text DEFAULT 'PENDING',
	"quantity" integer NOT NULL,
	"jobId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" varchar(64) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"location" text NOT NULL,
	"imageUrl" text,
	"startDateTime" timestamp with time zone NOT NULL,
	"totalSeats" integer NOT NULL,
	"availableSeats" integer NOT NULL,
	"price" numeric(10, 2) DEFAULT '0',
	"organizerId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ticket" (
	"id" text PRIMARY KEY NOT NULL,
	"bookingId" text NOT NULL,
	"qrCodeData" text NOT NULL,
	"isUsed" boolean DEFAULT false NOT NULL,
	"scannedAt" timestamp,
	CONSTRAINT "ticket_qrCodeData_unique" UNIQUE("qrCodeData")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"role" text DEFAULT 'USER',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_eventId_event_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_organizerId_user_id_fk" FOREIGN KEY ("organizerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_bookingId_booking_id_fk" FOREIGN KEY ("bookingId") REFERENCES "public"."booking"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booking_user_event_idx" ON "booking" USING btree ("userId","eventId");--> statement-breakpoint
CREATE INDEX "event_slug_idx" ON "event" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "event_organizer_id_idx" ON "event" USING btree ("organizerId");--> statement-breakpoint
CREATE INDEX "ticket_booking_id_idx" ON "ticket" USING btree ("bookingId");--> statement-breakpoint
CREATE INDEX "ticket_qr_data_idx" ON "ticket" USING btree ("qrCodeData");