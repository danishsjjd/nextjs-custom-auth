"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { logOut } from "../actions";

const LogoutButton = () => {
  return (
    <Button variant={"destructive"} onClick={() => logOut()}>
      Logout
    </Button>
  );
};

export default LogoutButton;
