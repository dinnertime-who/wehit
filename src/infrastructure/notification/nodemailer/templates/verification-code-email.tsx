import { EmailLayout } from "../components/email-layout";
import {
  Heading,
  Text,
  Hr,
} from "@react-email/components";

type VerificationCodeEmailProps = {
  code: string;
};

export const VerificationCodeEmail = ({
  code,
}: VerificationCodeEmailProps) => {
  return (
    <EmailLayout>
      <Heading
        style={{
          color: "#333",
          fontSize: "24px",
          fontWeight: "bold",
          margin: "0 0 20px",
        }}
      >
        이메일 인증번호
      </Heading>
      <Text style={{ color: "#666", fontSize: "16px", lineHeight: "24px" }}>
        안녕하세요,
      </Text>
      <Text style={{ color: "#666", fontSize: "16px", lineHeight: "24px" }}>
        회원가입을 위한 이메일 인증번호를 발송해드립니다.
      </Text>
      <div
        style={{
          backgroundColor: "#f4f4f4",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          margin: "30px 0",
        }}
      >
        <Text
          style={{
            color: "#333",
            fontSize: "32px",
            fontWeight: "bold",
            letterSpacing: "8px",
            margin: "0",
            fontFamily: "monospace",
          }}
        >
          {code}
        </Text>
      </div>
      <Text style={{ color: "#666", fontSize: "14px", lineHeight: "20px" }}>
        인증번호는 <strong>5분</strong>간 유효합니다.
      </Text>
      <Text style={{ color: "#666", fontSize: "14px", lineHeight: "20px" }}>
        본인이 요청한 것이 아니라면 이 이메일을 무시하셔도 됩니다.
      </Text>
      <Hr style={{ borderColor: "#e6e6e6", margin: "30px 0" }} />
      <Text
        style={{
          color: "#999",
          fontSize: "12px",
          lineHeight: "18px",
          margin: "0",
        }}
      >
        이 이메일은 자동으로 발송되었습니다.
      </Text>
    </EmailLayout>
  );
};

