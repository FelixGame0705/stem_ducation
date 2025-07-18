CREATE TABLE `admin_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`submitted_at` timestamp DEFAULT (now()),
	`processed` boolean DEFAULT false,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`image` varchar(500) NOT NULL,
	`start_date` timestamp NOT NULL DEFAULT (now()),
	`end_date` timestamp NOT NULL DEFAULT (now()),
	`location` varchar(255) NOT NULL,
	`registration_required` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `events_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`image` varchar(500) NOT NULL,
	`category` varchar(100) NOT NULL,
	`published_at` timestamp NOT NULL,
	`featured` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `news_id` PRIMARY KEY(`id`),
	CONSTRAINT `news_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`age_range` varchar(100) NOT NULL,
	`objectives` text NOT NULL,
	`image` varchar(500) NOT NULL,
	`color` varchar(50) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `programs_id` PRIMARY KEY(`id`),
	CONSTRAINT `programs_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `recruitments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`requirements` text NOT NULL,
	`benefits` text NOT NULL,
	`deadline` timestamp NOT NULL,
	`location` varchar(255) NOT NULL,
	`salary` varchar(255),
	`type` varchar(100) NOT NULL,
	`url` varchar(500),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `recruitments_id` PRIMARY KEY(`id`),
	CONSTRAINT `recruitments_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`school` varchar(255) NOT NULL,
	`grade` varchar(50) NOT NULL,
	`achievement` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`image` varchar(500) NOT NULL,
	`program` varchar(255) NOT NULL,
	`year` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `students_id` PRIMARY KEY(`id`)
);
