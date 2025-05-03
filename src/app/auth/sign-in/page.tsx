import { signInAction } from "@/lib/actions/auth-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function SignIn(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="w-fit">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 [&>input]:mb-3">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
        </CardContent>
        <CardFooter>
          <SubmitButton pendingText="Signing In..." formAction={signInAction} className="w-full">
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </CardFooter>
      </Card>
    </form>
  );
}
