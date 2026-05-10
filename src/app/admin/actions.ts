"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string;
  
  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set("admin_token", password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    redirect("/admin");
  } else {
    // Basic incorrect password handling. For a real app, use useFormState.
    redirect("/admin?error=incorrect");
  }
}
