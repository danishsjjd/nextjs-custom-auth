import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const PrivatePage = () => {
  const fullUser = { id: "", name: "Danish", role: "user" };

  return (
    <section>
      <h1 className="text-4xl font-medium pb-4">Private: {fullUser?.role}</h1>

      <div className="flex items-center gap-4">
        <Button>Toggle Role</Button>
        <Button asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </section>
  );
};

export default PrivatePage;
