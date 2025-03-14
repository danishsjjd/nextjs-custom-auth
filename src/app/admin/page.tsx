import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const AdminPage = () => {
  return (
    <section>
      <h1 className="text-4xl font-medium pb-4">Admin</h1>
      <Button asChild>
        <Link href="/">Home</Link>
      </Button>
    </section>
  );
};

export default AdminPage;
