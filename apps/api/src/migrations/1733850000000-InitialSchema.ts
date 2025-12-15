import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1733850000000 implements MigrationInterface {
  name = 'InitialSchema1733850000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar(255) UNIQUE NOT NULL,
        "username" varchar(100) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "profile_image_url" varchar(255),
        "role" varchar(50) DEFAULT 'user',
        "subscription_tier" varchar(50) DEFAULT 'free',
        "credits" int DEFAULT 0,
        "reset_token" varchar(255),
        "reset_token_expires_at" timestamp,
        "last_login_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        "deleted_at" timestamp
      )
    `);

    // Create characters table
    await queryRunner.query(`
      CREATE TABLE "characters" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "thumbnail_url" varchar(255),
        "model_id" varchar(255),
        "training_status" varchar(50),
        "training_completed_at" timestamp,
        "is_public" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create reference_images table
    await queryRunner.query(`
      CREATE TABLE "reference_images" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "character_id" uuid NOT NULL,
        "image_url" varchar(255) NOT NULL,
        "file_size" varchar(255),
        "width" int,
        "height" int,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE
      )
    `);

    // Create character_training_images table
    await queryRunner.query(`
      CREATE TABLE "character_training_images" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "character_id" uuid NOT NULL,
        "image_url" varchar(255) NOT NULL,
        "file_size" varchar(255),
        "width" int,
        "height" int,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE
      )
    `);

    // Create generation_sessions table
    await queryRunner.query(`
      CREATE TABLE "generation_sessions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "character_id" uuid,
        "prompt" text NOT NULL,
        "negative_prompt" text,
        "status" varchar(50) DEFAULT 'pending',
        "num_images" int DEFAULT 1,
        "credits_used" int,
        "completed_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE SET NULL
      )
    `);

    // Create generation_settings table
    await queryRunner.query(`
      CREATE TABLE "generation_settings" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "session_id" uuid NOT NULL,
        "resolution_width" int DEFAULT 512,
        "resolution_height" int DEFAULT 512,
        "model_version" varchar(100),
        "num_steps" int DEFAULT 30,
        "guidance_scale" decimal(3,1) DEFAULT 7.5,
        "sampler" varchar(100),
        "seed" int,
        "lora_model" varchar(255),
        "lora_strength" decimal(3,2),
        "controlnet_model" varchar(255),
        "controlnet_image_url" varchar(255),
        "controlnet_strength" decimal(3,2),
        "background_prompt" varchar(255),
        "foreground_prompt" varchar(255),
        "lighting_direction" varchar(100),
        "custom_strength" varchar(100),
        "misc" jsonb,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("session_id") REFERENCES "generation_sessions"("id") ON DELETE CASCADE
      )
    `);

    // Create generated_images table
    await queryRunner.query(`
      CREATE TABLE "generated_images" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "session_id" uuid NOT NULL,
        "image_url" varchar(255) NOT NULL,
        "thumbnail_url" varchar(255),
        "file_size" varchar(255),
        "width" int,
        "height" int,
        "seed" int,
        "is_favorited" boolean DEFAULT false,
        "generation_model" varchar(100),
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("session_id") REFERENCES "generation_sessions"("id") ON DELETE CASCADE
      )
    `);

    // Create refinement_jobs table
    await queryRunner.query(`
      CREATE TABLE "refinement_jobs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "original_image_id" uuid NOT NULL,
        "refinement_type" varchar(50) NOT NULL,
        "status" varchar(50) DEFAULT 'pending',
        "refined_image_url" varchar(255),
        "refinement_parameters" jsonb,
        "credits_used" int,
        "completed_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("original_image_id") REFERENCES "generated_images"("id") ON DELETE CASCADE
      )
    `);

    // Create image_tags table
    await queryRunner.query(`
      CREATE TABLE "image_tags" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tag_name" varchar(100) UNIQUE NOT NULL,
        "category" varchar(100),
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create generated_image_tags table
    await queryRunner.query(`
      CREATE TABLE "generated_image_tags" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "generated_image_id" uuid NOT NULL,
        "tag_id" uuid NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("generated_image_id") REFERENCES "generated_images"("id") ON DELETE CASCADE,
        FOREIGN KEY ("tag_id") REFERENCES "image_tags"("id") ON DELETE CASCADE
      )
    `);

    // Create collections table
    await queryRunner.query(`
      CREATE TABLE "collections" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "thumbnail_url" varchar(255),
        "is_public" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create collection_images table
    await queryRunner.query(`
      CREATE TABLE "collection_images" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "collection_id" uuid NOT NULL,
        "generated_image_id" uuid NOT NULL,
        "sort_order" int,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE,
        FOREIGN KEY ("generated_image_id") REFERENCES "generated_images"("id") ON DELETE CASCADE
      )
    `);

    // Create subscriptions table
    await queryRunner.query(`
      CREATE TABLE "subscriptions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "tier" varchar(50) NOT NULL,
        "status" varchar(50) DEFAULT 'active',
        "start_date" timestamp NOT NULL,
        "end_date" timestamp,
        "next_billing_date" timestamp,
        "price" decimal(10,2),
        "stripe_subscription_id" varchar(255),
        "auto_renew" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create credit_transactions table
    await queryRunner.query(`
      CREATE TABLE "credit_transactions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "transaction_type" varchar(50) NOT NULL,
        "amount" int NOT NULL,
        "balance_after" int NOT NULL,
        "reference_id" varchar(255),
        "description" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create payment_transactions table
    await queryRunner.query(`
      CREATE TABLE "payment_transactions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "subscription_id" uuid,
        "amount" decimal(10,2) NOT NULL,
        "currency" varchar(3) DEFAULT 'USD',
        "status" varchar(50) DEFAULT 'pending',
        "payment_method" varchar(50) NOT NULL,
        "stripe_payment_intent_id" varchar(255),
        "stripe_charge_id" varchar(255),
        "failure_reason" text,
        "paid_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create shared_images table
    await queryRunner.query(`
      CREATE TABLE "shared_images" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "generated_image_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "share_token" varchar(255) UNIQUE NOT NULL,
        "is_public" boolean DEFAULT false,
        "expires_at" timestamp,
        "view_count" int DEFAULT 0,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("generated_image_id") REFERENCES "generated_images"("id") ON DELETE CASCADE,
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create user_preferences table
    await queryRunner.query(`
      CREATE TABLE "user_preferences" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid UNIQUE NOT NULL,
        "language" varchar(100) DEFAULT 'en',
        "theme" varchar(50) DEFAULT 'light',
        "email_notifications" boolean DEFAULT true,
        "push_notifications" boolean DEFAULT false,
        "default_resolution" varchar(100),
        "default_model" varchar(100),
        "nsfw_filter" boolean DEFAULT false,
        "show_in_gallery" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create pose_library table
    await queryRunner.query(`
      CREATE TABLE "pose_library" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "pose_name" varchar(255) NOT NULL,
        "description" text,
        "pose_image_url" varchar(255) NOT NULL,
        "category" varchar(100),
        "difficulty" varchar(100),
        "keypoints" jsonb,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create activity_logs table
    await queryRunner.query(`
      CREATE TABLE "activity_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "action" varchar(100) NOT NULL,
        "entity_type" varchar(100),
        "entity_id" uuid,
        "metadata" jsonb,
        "ip_address" varchar(45),
        "user_agent" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create notification_queue table
    await queryRunner.query(`
      CREATE TABLE "notification_queue" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "notification_type" varchar(50) NOT NULL,
        "subject" varchar(255) NOT NULL,
        "message" text NOT NULL,
        "status" varchar(50) DEFAULT 'pending',
        "retry_count" int DEFAULT 0,
        "sent_at" timestamp,
        "error_message" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users"("email")`);
    await queryRunner.query(`CREATE INDEX "idx_characters_user_id" ON "characters"("user_id")`);
    await queryRunner.query(`CREATE INDEX "idx_generation_sessions_user_id" ON "generation_sessions"("user_id")`);
    await queryRunner.query(`CREATE INDEX "idx_generated_images_session_id" ON "generated_images"("session_id")`);
    await queryRunner.query(`CREATE INDEX "idx_collections_user_id" ON "collections"("user_id")`);
    await queryRunner.query(`CREATE INDEX "idx_credit_transactions_user_id" ON "credit_transactions"("user_id")`);
    await queryRunner.query(`CREATE INDEX "idx_activity_logs_user_id" ON "activity_logs"("user_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "notification_queue"`);
    await queryRunner.query(`DROP TABLE "activity_logs"`);
    await queryRunner.query(`DROP TABLE "pose_library"`);
    await queryRunner.query(`DROP TABLE "user_preferences"`);
    await queryRunner.query(`DROP TABLE "shared_images"`);
    await queryRunner.query(`DROP TABLE "payment_transactions"`);
    await queryRunner.query(`DROP TABLE "credit_transactions"`);
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TABLE "collection_images"`);
    await queryRunner.query(`DROP TABLE "collections"`);
    await queryRunner.query(`DROP TABLE "generated_image_tags"`);
    await queryRunner.query(`DROP TABLE "image_tags"`);
    await queryRunner.query(`DROP TABLE "refinement_jobs"`);
    await queryRunner.query(`DROP TABLE "generated_images"`);
    await queryRunner.query(`DROP TABLE "generation_settings"`);
    await queryRunner.query(`DROP TABLE "generation_sessions"`);
    await queryRunner.query(`DROP TABLE "character_training_images"`);
    await queryRunner.query(`DROP TABLE "reference_images"`);
    await queryRunner.query(`DROP TABLE "characters"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
