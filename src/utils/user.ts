/**
 * 사용자 프로필 완료 여부 확인
 * @param user - 사용자 객체 (phone, birthDate, gender, profileCompleted 필드 포함)
 * @returns 프로필이 완료되었는지 여부
 */
export function isProfileCompleted(user: {
  phone?: string | null;
  birthDate?: string | Date | null;
  gender?: string | null;
  profileCompleted?: boolean | null;
}): boolean {
  // profileCompleted가 true이면 완료로 간주
  if (user.profileCompleted === true) {
    return true;
  }

  // 필수 필드가 모두 입력되어 있는지 확인
  return !!(
    user.phone &&
    user.birthDate &&
    user.gender &&
    user.phone.trim() !== "" &&
    user.gender.trim() !== ""
  );
}

/**
 * 필수 필드 확인
 * @param user - 사용자 객체
 * @returns 필수 필드가 모두 입력되어 있는지 여부
 */
export function checkRequiredFields(user: {
  phone?: string | null;
  birthDate?: string | Date | null;
  gender?: string | null;
}): boolean {
  return !!(
    user.phone &&
    user.birthDate &&
    user.gender &&
    user.phone.trim() !== "" &&
    user.gender.trim() !== ""
  );
}

