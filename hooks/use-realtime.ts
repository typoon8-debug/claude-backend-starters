'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useNotesStore } from '@/stores/notes-store'
import type { Note } from '@/lib/supabase/types'

interface RealtimeEvent {
  id: string
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: Partial<Note>
  timestamp: string
}

/**
 * Supabase Realtime 구독 훅 (notes 테이블)
 * 변경사항을 Zustand 스토어에 실시간 반영
 */
export function useNotesRealtime() {
  const { addNote, updateNote, removeNote } = useNotesStore()
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('realtime-notes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          const event: RealtimeEvent = {
            id: crypto.randomUUID(),
            eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            table: payload.table,
            record:
              payload.eventType === 'DELETE'
                ? (payload.old as Partial<Note>)
                : (payload.new as Partial<Note>),
            timestamp: new Date().toISOString(),
          }

          // 이벤트 로그 추가 (최근 20개 유지)
          setEvents((prev) => [event, ...prev].slice(0, 20))

          // Zustand 스토어 업데이트
          if (payload.eventType === 'INSERT') {
            addNote(payload.new as Note)
          } else if (payload.eventType === 'UPDATE') {
            updateNote(payload.new as Note)
          } else if (payload.eventType === 'DELETE') {
            removeNote((payload.old as { id: string }).id)
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    // 컴포넌트 언마운트 시 채널 구독 해제
    return () => {
      supabase.removeChannel(channel)
    }
  }, [addNote, updateNote, removeNote])

  return { events, isConnected }
}
