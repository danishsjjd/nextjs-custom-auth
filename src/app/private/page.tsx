import { toggleRole } from "@/actions/toggle-role";
import { getCurrentUser } from "@/auth/nextjs/current-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const PrivatePage = async () => {
  const fullUser = await getCurrentUser({ redirectIfNotAuthenticated: true });

  console.log("private page", fullUser);

  return (
    <section>
      <h1 className="text-4xl font-medium pb-4">Private: {fullUser?.role}</h1>

      <div className="flex items-center gap-4">
        <Button onClick={toggleRole}>Toggle Role</Button>
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </section>
  );
};

export default PrivatePage;
