"use client";

import { Button } from "@/components/ui/button";
import { OAuthProvider } from "@/drizzle/schema";
import { oAuthSignin } from "../actions";

const OauthButton = ({
  provider,
  signUp,
}: {
  provider: OAuthProvider;
  signUp?: boolean;
}) => {
  return (
    <Button onClick={() => oAuthSignin(provider)}>
      {signUp ? "Sign up" : "Sign in"} with {provider}
    </Button>
  );
};

export default OauthButton;
