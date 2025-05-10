import { signOutAction } from "@/lib/actions/auth-actions";
import Link from "next/link";
import { Button } from "@/lib/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/lib/components/ui/dropdown-menu";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">{user.email}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/">
              <DropdownMenuItem>
                Dashboard
              </DropdownMenuItem>
            </Link>
            <Link href="/systems">
              <DropdownMenuItem>
                Systems
              </DropdownMenuItem>
            </Link>
            <Link href="/users">
              <DropdownMenuItem>
                Users
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <form action={signOutAction}>
            <button type="submit" className="w-full">
              <DropdownMenuItem>
                Sign out
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm">
        <Link href="/auth/sign-in">Sign in</Link>
      </Button>
    </div>
  );
}
