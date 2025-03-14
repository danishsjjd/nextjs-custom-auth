"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { logOut } from "../actions";

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant={"destructive"}
      onClick={async () => {
        try {
          setLoading(true);
          await logOut();
        } finally {
          setLoading(false);
        }
      }}
      disabled={loading}
    >
      {loading ? "Logging Out..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;
