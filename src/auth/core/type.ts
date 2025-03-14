export type Cookies = {
  get: (name: string) => { name: string; value: string } | undefined;
  set: (
    name: string,
    value: string,
    options?: Partial<{
      httpOnly: boolean;
      secure: boolean;
      maxAge: number;
      path: string;
      sameSite: "lax" | "strict" | "none";
    }>
  ) => void;
  delete: (name: string) => void;
};
