"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInAppForm } from "../forms/sign-in-form";

export const SignInForm = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>WeHit 관리자 로그인</CardTitle>
      </CardHeader>
      <CardContent>
        <SignInAppForm redirectTo="/admin" />
      </CardContent>
    </Card>
  );
};
