export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type TaskStatus = "pending" | "in_progress" | "completed" | "skipped";
export type MistakeType = "concept" | "calculation" | "silly" | "time_management";
export type ErrorStatus = "open" | "reviewing" | "resolved";
export type NotificationType = "planner" | "reminder" | "mock" | "streak" | "revision" | "system";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          avatar_url: string | null;
          target_exam: string | null;
          target_score: number | null;
          exam_date: string | null;
          timezone: string | null;
          daily_study_goal_hours: number | null;
          college_schedule: Json;
          gym_schedule: Json;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          target_exam?: string | null;
          target_score?: number | null;
          exam_date?: string | null;
          timezone?: string | null;
          daily_study_goal_hours?: number | null;
          college_schedule?: Json;
          gym_schedule?: Json;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      daily_tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          subject: string | null;
          topic: string | null;
          subtopic: string | null;
          priority: number;
          estimated_minutes: number | null;
          actual_minutes: number;
          due_date: string | null;
          reminder_time: string | null;
          status: TaskStatus;
          recurrence_rule: string | null;
          notes: string | null;
          attachment_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          subject?: string | null;
          topic?: string | null;
          subtopic?: string | null;
          priority?: number;
          estimated_minutes?: number | null;
          actual_minutes?: number;
          due_date?: string | null;
          reminder_time?: string | null;
          status?: TaskStatus;
          recurrence_rule?: string | null;
          notes?: string | null;
          attachment_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_tasks"]["Insert"]>;
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          subject: string | null;
          topic: string | null;
          started_at: string;
          ended_at: string | null;
          duration_minutes: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id?: string | null;
          subject?: string | null;
          topic?: string | null;
          started_at: string;
          ended_at?: string | null;
          duration_minutes?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["study_sessions"]["Insert"]>;
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          topic: string | null;
          subtopic: string | null;
          completion_percentage: number;
          mastery_percentage: number;
          questions_solved: number;
          correct_answers: number;
          incorrect_answers: number;
          revision_count: number;
          last_revision_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          topic?: string | null;
          subtopic?: string | null;
          completion_percentage?: number;
          mastery_percentage?: number;
          questions_solved?: number;
          correct_answers?: number;
          incorrect_answers?: number;
          revision_count?: number;
          last_revision_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["progress"]["Insert"]>;
      };
      knowledge_notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          subject: string | null;
          topic: string | null;
          subtopic: string | null;
          tags: string[];
          is_formula: boolean;
          is_bookmarked: boolean;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content?: string;
          subject?: string | null;
          topic?: string | null;
          subtopic?: string | null;
          tags?: string[];
          is_formula?: boolean;
          is_bookmarked?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["knowledge_notes"]["Insert"]>;
      };
      flashcards: {
        Row: {
          id: string;
          user_id: string;
          note_id: string | null;
          front: string;
          back: string;
          difficulty: number;
          next_review: string | null;
          review_interval: number;
          repetitions: number;
          ease_factor: number;
          last_review: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          note_id?: string | null;
          front: string;
          back: string;
          difficulty?: number;
          next_review?: string | null;
          review_interval?: number;
          repetitions?: number;
          ease_factor?: number;
          last_review?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["flashcards"]["Insert"]>;
      };
      attachments: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          storage_path: string;
          mime_type: string;
          size: number;
          linked_table: string | null;
          linked_record_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          storage_path: string;
          mime_type: string;
          size: number;
          linked_table?: string | null;
          linked_record_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["attachments"]["Insert"]>;
      };
      error_logs: {
        Row: {
          id: string;
          user_id: string;
          subject: string | null;
          topic: string | null;
          subtopic: string | null;
          question_title: string | null;
          mistake_type: MistakeType;
          difficulty: number | null;
          explanation: string | null;
          correct_solution: string | null;
          screenshot_attachment_id: string | null;
          review_date: string | null;
          revision_count: number;
          status: ErrorStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject?: string | null;
          topic?: string | null;
          subtopic?: string | null;
          question_title?: string | null;
          mistake_type: MistakeType;
          difficulty?: number | null;
          explanation?: string | null;
          correct_solution?: string | null;
          screenshot_attachment_id?: string | null;
          review_date?: string | null;
          revision_count?: number;
          status?: ErrorStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["error_logs"]["Insert"]>;
      };
      mock_tests: {
        Row: {
          id: string;
          user_id: string;
          mock_name: string;
          provider: string | null;
          test_date: string | null;
          total_score: number | null;
          percentile: number | null;
          duration_minutes: number | null;
          overall_accuracy: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mock_name: string;
          provider?: string | null;
          test_date?: string | null;
          total_score?: number | null;
          percentile?: number | null;
          duration_minutes?: number | null;
          overall_accuracy?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["mock_tests"]["Insert"]>;
      };
      mock_sections: {
        Row: {
          id: string;
          mock_test_id: string;
          section_name: string;
          attempts: number;
          correct: number;
          incorrect: number;
          skipped: number;
          score: number | null;
          accuracy: number | null;
          time_spent_minutes: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mock_test_id: string;
          section_name: string;
          attempts?: number;
          correct?: number;
          incorrect?: number;
          skipped?: number;
          score?: number | null;
          accuracy?: number | null;
          time_spent_minutes?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["mock_sections"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: NotificationType;
          is_read: boolean;
          scheduled_for: string | null;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: NotificationType;
          is_read?: boolean;
          scheduled_for?: string | null;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      roadmap: {
        Row: {
          id: string;
          user_id: string;
          roadmap_version: number;
          start_date: string | null;
          end_date: string | null;
          roadmap_json: Json;
          generated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          roadmap_version?: number;
          start_date?: string | null;
          end_date?: string | null;
          roadmap_json?: Json;
          generated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["roadmap"]["Insert"]>;
      };
      settings: {
        Row: {
          id: string;
          user_id: string;
          theme: string | null;
          accent_color: string | null;
          notifications_enabled: boolean;
          push_enabled: boolean;
          language: string;
          first_day_of_week: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: string | null;
          accent_color?: string | null;
          notifications_enabled?: boolean;
          push_enabled?: boolean;
          language?: string;
          first_day_of_week?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_name: string;
          achievement_key: string;
          unlocked_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_name: string;
          achievement_key: string;
          unlocked_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Insert"]>;
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["activity_logs"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      task_status: TaskStatus;
      mistake_type: MistakeType;
      error_status: ErrorStatus;
      notification_type: NotificationType;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type PublicTableName = keyof Database["public"]["Tables"];
export type TableRow<T extends PublicTableName> = Database["public"]["Tables"][T]["Row"];
export type TableInsert<T extends PublicTableName> = Database["public"]["Tables"][T]["Insert"];
export type TableUpdate<T extends PublicTableName> = Database["public"]["Tables"][T]["Update"];
