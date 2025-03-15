import SignInForm from "@/auth/nextjs/components/sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OauthButton from "@/auth/nextjs/components/oauth-button";

async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>;
}) {
  const { oauthError } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your account to continue.</CardDescription>
        {oauthError && <p className="text-destructive">{oauthError}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <OauthButton provider="discord" />
        <SignInForm />
      </CardContent>
    </Card>
  );
}

export default SignInPage;
