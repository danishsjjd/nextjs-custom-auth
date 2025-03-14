import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import LogoutButton from "@/auth/nextjs/components/logout-button";
import { getCurrentUser } from "@/auth/nextjs/current-user";

export default async function Home() {
  const fullUser = await getCurrentUser({
    withFullUser: true,
  });

  if (fullUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User: {fullUser.id}</CardTitle>
          <CardDescription>Role: {fullUser.role}</CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/private">Private page</Link>
          </Button>
          {fullUser.role === "admin" && (
            <Button asChild variant={"outline"}>
              <Link href="/admin">Admin page</Link>
            </Button>
          )}
          <LogoutButton />
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="flex gap-4">
      <Button asChild>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
