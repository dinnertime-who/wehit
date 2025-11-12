import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="app-container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="font-bold text-lg mb-4">WiHit</h3>
            <p className="text-sm text-muted-foreground">
              배움을 재밌게, WiHit!
            </p>
            <div className="flex space-x-4 mt-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* 고객 지원 */}
          <div>
            <h4 className="font-semibold mb-4">고객 지원</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  고객센터
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  공지사항
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* 정책 */}
          <div>
            <h4 className="font-semibold mb-4">정책</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  환불정책
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  사업자 정보
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="border-t pt-8">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              상호명: (주)Wihit | 대표자: 홍길동 | 사업자등록번호: 123-45-67890
            </p>
            <p>
              통신판매업신고: 2024-서울강남-12345 | 주소: 서울특별시 강남구
              테헤란로 123
            </p>
            <p>고객센터: 1234-5678 | 이메일: help@wihit.me</p>
            <p className="mt-4">© 2025 Wihit. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
