// app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page =  async() => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }

  return <div>Redirecting...</div>;
};

export default Page;
