import { signInAction } from "@/lib/actions/auth-actions";

import { SubmitButton } from "@/lib/components/ux/submit-button";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import SignInForm from "@/lib/components/forms/sign-in-form";
import { Separator } from "@/lib/components/ui/separator";

export default async function SignIn(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Welcome back to Fortivector!
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2 [&>input]:mb-3">
        <SignInForm action={signInAction} />

      </CardContent>
    </Card>
  );
}
