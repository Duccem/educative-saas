CREATE TYPE "public"."assessment_grade_status" AS ENUM('draft', 'published', 'excused', 'missing');--> statement-breakpoint
CREATE TYPE "public"."assessment_type" AS ENUM('exam', 'quiz', 'assignment', 'project', 'participation', 'recovery', 'other');--> statement-breakpoint
CREATE TYPE "public"."course_final_grade_status" AS ENUM('in_progress', 'finalized', 'published');--> statement-breakpoint
CREATE TABLE "assessment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"academic_term_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "assessment_type" DEFAULT 'other' NOT NULL,
	"weight" numeric(5, 2) DEFAULT '1.00' NOT NULL,
	"max_score" numeric(8, 2) DEFAULT '100.00' NOT NULL,
	"due_time" timestamp,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_final_grade" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"final_score" numeric(8, 2) DEFAULT '0.00' NOT NULL,
	"final_letter" text,
	"is_passing" boolean DEFAULT false NOT NULL,
	"status" "course_final_grade_status" DEFAULT 'in_progress' NOT NULL,
	"notes" text,
	"calculated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	"locked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_assessment_grade" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"assessment_id" uuid NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"grader_id" uuid,
	"raw_score" numeric(8, 2) DEFAULT '0.00' NOT NULL,
	"extra_credit" numeric(8, 2) DEFAULT '0.00' NOT NULL,
	"penalty_score" numeric(8, 2) DEFAULT '0.00' NOT NULL,
	"final_score" numeric(8, 2) DEFAULT '0.00' NOT NULL,
	"feedback" text,
	"status" "assessment_grade_status" DEFAULT 'draft' NOT NULL,
	"graded_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "enrollment" ADD COLUMN "final_score" numeric(8, 2);--> statement-breakpoint
ALTER TABLE "enrollment" ADD COLUMN "final_letter" text;--> statement-breakpoint
ALTER TABLE "enrollment" ADD COLUMN "is_passing" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollment" ADD COLUMN "finalized_at" timestamp;--> statement-breakpoint
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_academic_term_id_academic_term_id_fk" FOREIGN KEY ("academic_term_id") REFERENCES "public"."academic_term"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment" ADD CONSTRAINT "assessment_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_final_grade" ADD CONSTRAINT "course_final_grade_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_final_grade" ADD CONSTRAINT "course_final_grade_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_final_grade" ADD CONSTRAINT "course_final_grade_enrollment_id_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_final_grade" ADD CONSTRAINT "course_final_grade_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_assessment_grade" ADD CONSTRAINT "student_assessment_grade_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_assessment_grade" ADD CONSTRAINT "student_assessment_grade_assessment_id_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_assessment_grade" ADD CONSTRAINT "student_assessment_grade_enrollment_id_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_assessment_grade" ADD CONSTRAINT "student_assessment_grade_grader_id_user_id_fk" FOREIGN KEY ("grader_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assessment_course_idx" ON "assessment" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "assessment_org_term_idx" ON "assessment" USING btree ("organization_id","academic_term_id");--> statement-breakpoint
CREATE UNIQUE INDEX "course_final_grade_enrollment_unique" ON "course_final_grade" USING btree ("enrollment_id");--> statement-breakpoint
CREATE INDEX "course_final_grade_course_idx" ON "course_final_grade" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "course_final_grade_student_idx" ON "course_final_grade" USING btree ("student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "student_assessment_grade_unique" ON "student_assessment_grade" USING btree ("assessment_id","enrollment_id");--> statement-breakpoint
CREATE INDEX "student_assessment_grade_enrollment_idx" ON "student_assessment_grade" USING btree ("enrollment_id");