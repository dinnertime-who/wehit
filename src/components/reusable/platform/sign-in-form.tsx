import Link from "next/link";
import { SignInAppForm } from "../forms/sign-in-form";

export const SignInForm = () => {
  return (
    <div>
      <SignInAppForm redirectTo="/" />

      <div className="flex items-center justify-end text-sm mt-4">
        <Link
          href={"/find-account"}
          className="text-gray-600 hover:text-gray-900"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </div>
    </div>
  );
};
