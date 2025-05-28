import {
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable),
}));

export const clinicsTable = pgTable('clinics', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  usersToClinics: many(usersToClinicsTable),
}));

export const usersToClinicsTable = pgTable('users_to_clinics', {
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id),
  clinicId: uuid('clinic_id')
    .notNull()
    .references(() => clinicsTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersToClinicsTableRelations = relations(
  usersToClinicsTable,
  ({ one }) => ({
    usersTable: one(usersTable, {
      fields: [usersToClinicsTable.userId],
      references: [usersTable.id],
    }),
    clinicsTable: one(clinicsTable, {
      fields: [usersToClinicsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);

export const doctorsTable = pgTable('doctors', {
  id: uuid('id').defaultRandom().primaryKey(),
  clinicId: uuid('clinic_id')
    .notNull()
    .references(() => clinicsTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  avatarImageUrl: text('avatar_image_url'),
  specialty: text('specialty').notNull(),
  // 0 - 6 (0 = Sunday, 6 = Saturday)
  avaiableFromWeekDay: integer('avaiable_from_week_day').notNull(),
  avaiableToWeekDay: integer('avaiable_to_week_day').notNull(),
  avaiableFromTime: time('avaiable_from_time').notNull(),
  avaiableToTime: time('avaiable_to_time').notNull(),
  appointmentPriceInCents: integer('appointment_price_in_cents').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const doctorsTableRelations = relations(
  doctorsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [doctorsTable.clinicId],
      references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable),
  }),
);

export const patientSexEnum = pgEnum('patient_sex', ['male', 'female']);

export const patientsTable = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(),
  clinicId: uuid('clinic_id')
    .notNull()
    .references(() => clinicsTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phoneNumber: text('phone_number').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  sex: patientSexEnum('sex').notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const patientsTableRelations = relations(
  patientsTable,
  ({ one, many }) => ({
    clinic: one(clinicsTable, {
      fields: [patientsTable.clinicId],
      references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable),
  }),
);

export const appointmentsTable = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date').notNull(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patientsTable.id, { onDelete: 'cascade' }),
  doctorId: uuid('doctor_id')
    .notNull()
    .references(() => doctorsTable.id, { onDelete: 'cascade' }),
  clinicId: uuid('clinic_id')
    .notNull()
    .references(() => clinicsTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const appointmentsTableRelations = relations(
  appointmentsTable,
  ({ one }) => ({
    patient: one(patientsTable, {
      fields: [appointmentsTable.patientId],
      references: [patientsTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [appointmentsTable.doctorId],
      references: [doctorsTable.id],
    }),
    clinic: one(clinicsTable, {
      fields: [appointmentsTable.clinicId],
      references: [clinicsTable.id],
    }),
  }),
);
