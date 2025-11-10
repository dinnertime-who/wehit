/**
 * 6자리 랜덤 인증번호 생성
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Redis 키 생성
 */
export function getVerificationKey(email: string): string {
  return `verification:email:${email}`;
}

/**
 * 인증번호 만료 시간 (5분)
 */
export const VERIFICATION_CODE_EXPIRY = 60 * 5; // 5분 (초 단위)

