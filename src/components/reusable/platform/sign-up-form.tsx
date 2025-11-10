import Link from "next/link";
import { SignUpAppForm } from "../forms/sign-up-form";

export const SignUpForm = () => {
  return (
    <div>
      <SignUpAppForm redirectTo="/" />

      <div className="flex items-center justify-end text-sm mt-4">
        <Link
          href={"/sign-in"}
          className="text-gray-600 hover:text-gray-900"
        >
          이미 계정이 있으신가요?
        </Link>
      </div>
    </div>
  );
};

