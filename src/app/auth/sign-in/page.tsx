
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
import { signInAction } from "@/lib/actions/auth";

export default async function SignIn() {
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
        <SignInForm
          footer={{
            submit_text: "Sign In",
            pending_text: "Signing In..."
          }}
          action={signInAction}
        />

      </CardContent>
    </Card>
  );
}
