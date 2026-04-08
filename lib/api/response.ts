import { NextResponse } from 'next/server'

/**
 * 성공 응답 헬퍼
 * @param data - 응답 데이터
 * @param status - HTTP 상태 코드 (기본 200)
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status })
}

/**
 * 에러 응답 헬퍼
 * @param message - 에러 메시지
 * @param status - HTTP 상태 코드 (기본 500)
 */
export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status })
}

/** 인증 필요 에러 응답 */
export function apiUnauthorized() {
  return apiError('인증이 필요합니다', 401)
}

/** 요청 유효성 오류 응답 */
export function apiBadRequest(message: string) {
  return apiError(message, 400)
}

/** 리소스 없음 에러 응답 */
export function apiNotFound(resource = '리소스') {
  return apiError(`${resource}를 찾을 수 없습니다`, 404)
}
