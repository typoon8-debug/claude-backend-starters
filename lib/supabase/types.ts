/**
 * Supabase 데이터베이스 타입 정의
 * `npm run supabase:types` 명령어로 자동 생성 가능
 * 현재는 수동으로 정의된 타입 사용
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      file_records: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string
          file_size: number
          content_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_path: string
          file_size: number
          content_type: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_path?: string
          file_size?: number
          content_type?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

/** profiles 테이블 Row 타입 */
export type Profile = Database['public']['Tables']['profiles']['Row']

/** notes 테이블 Row 타입 */
export type Note = Database['public']['Tables']['notes']['Row']

/** file_records 테이블 Row 타입 */
export type FileRecord = Database['public']['Tables']['file_records']['Row']
