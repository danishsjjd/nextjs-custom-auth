import OauthButton from "@/auth/nextjs/components/oauth-button";
import SignUpForm from "@/auth/nextjs/components/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>;
}) {
  const { oauthError } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account to continue.</CardDescription>
        {oauthError && <p className="text-destructive">{oauthError}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <OauthButton provider="discord" signUp />
        <SignUpForm />
      </CardContent>
    </Card>
  );
}

export default SignUpPage;
