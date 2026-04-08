import { create } from 'zustand'
import type { Note } from '@/lib/supabase/types'

interface NotesState {
  /** 노트 목록 (낙관적 업데이트용) */
  notes: Note[]
  setNotes: (notes: Note[]) => void
  /** Realtime INSERT 이벤트 처리 */
  addNote: (note: Note) => void
  /** Realtime UPDATE 이벤트 처리 */
  updateNote: (note: Note) => void
  /** Realtime DELETE 이벤트 처리 */
  removeNote: (id: string) => void
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  setNotes: (notes) => set({ notes }),
  addNote: (note) =>
    set((state) => ({
      // 중복 방지 후 최신순으로 추가
      notes: state.notes.some((n) => n.id === note.id)
        ? state.notes
        : [note, ...state.notes],
    })),
  updateNote: (note) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === note.id ? note : n)),
    })),
  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),
}))
