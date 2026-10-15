CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`action` text NOT NULL,
	`details` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `candidates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`position_id` integer NOT NULL,
	`number` text NOT NULL,
	`name` text NOT NULL,
	`photo_url` text,
	`slogan` text,
	`proposals` text,
	`is_blank` integer DEFAULT false NOT NULL,
	`display_order` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `elections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`institution_name` text NOT NULL,
	`year` integer NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `positions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`election_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`display_order` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`document_id` text NOT NULL,
	`full_name` text NOT NULL,
	`grade` text DEFAULT '11' NOT NULL,
	`group_name` text DEFAULT '11-1' NOT NULL,
	`has_voted` integer DEFAULT false NOT NULL,
	`voted_at` integer,
	`verification_code` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_document_id_unique` ON `students` (`document_id`);--> statement-breakpoint
CREATE TABLE `votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`election_id` integer NOT NULL,
	`position_id` integer NOT NULL,
	`candidate_id` integer NOT NULL,
	`student_id` integer NOT NULL,
	`cast_at` integer,
	`vote_token` text
);
