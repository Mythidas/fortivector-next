import { signUpAction } from "@/app/actions";
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


export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <Card>
        <CardContent>
          <FormMessage message={searchParams} />
        </CardContent>
      </Card>
    );
  }

  return (
    <form className="w-1/3">
      <Card>
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Already have an account?{" "}
            <Link className="text-foreground font-medium underline" href="/sign-in">
              Sign in
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 [&>input]:mb-3">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
          <Label htmlFor="tenant">Tenant</Label>
          <Input
            type="text"
            name="tenant"
            placeholder="Your tenant"
            required
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <FormMessage message={searchParams} />
          <SubmitButton pendingText="Signing Up..." formAction={signUpAction} className="w-full">
            Sign up
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
}
