import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  primaryKey,
  index,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import { relations } from "drizzle-orm";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role").$type<"USER" | "ORGANIZER" | "ADMIN">().default("USER"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const events = pgTable("event", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  imageUrl: text("imageUrl"),
  startDateTime: timestamp("startDateTime", { withTimezone: true }).notNull(),
  totalSeats: integer("totalSeats").notNull(),
  availableSeats: integer("availableSeats").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  organizerId: text("organizerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  slugIdx: index("event_slug_idx").on(table.slug),
  organizerIdx: index("event_organizer_id_idx").on(table.organizerId),
}));

export const bookings = pgTable("booking", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  eventId: text("eventId")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").$type<"PENDING" | "CONFIRMED" | "FAILED" | "CANCELLED">().default("PENDING"),
  quantity: integer("quantity").notNull(),
  jobId: text("jobId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userEventIdx: index("booking_user_event_idx").on(table.userId, table.eventId),
}));

export const tickets = pgTable("ticket", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  bookingId: text("bookingId")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  qrCodeData: text("qrCodeData").notNull().unique(),
  isUsed: boolean("isUsed").default(false).notNull(),
  scannedAt: timestamp("scannedAt"),
}, (table) => ({
  bookingIdx: index("ticket_booking_id_idx").on(table.bookingId),
  qrIdx: index("ticket_qr_data_idx").on(table.qrCodeData),
}));

export const eventRelations = relations(events, ({ many, one }) => ({
  bookings: many(bookings),
  organizer: one(users, { fields: [events.organizerId], references: [users.id] }),
}));

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  event: one(events, { fields: [bookings.eventId], references: [events.id] }),
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  tickets: many(tickets),
}));