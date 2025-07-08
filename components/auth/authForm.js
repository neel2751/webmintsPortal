"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { GlobalForm } from "../form/global-form";
import { toast } from "sonner";

export default function AuthForm({ className }) {
  const { data: sessions } = useSession();
  if (sessions) {
    redirect("/admin/dashboard");
  }

  const field = [
    {
      fields: [
        {
          name: "email",
          labelText: "Email",
          type: "text",
          placeholder: "Email Address",
          validationOptions: {
            required: "Email is required",
            minLength: {
              value: 3,
              message: "Minimum 3 characters required",
            },
            maxLength: {
              value: 40,
              message: "Maximum 20 characters allowed",
            },
          },
        },
        {
          name: "password",
          labelText: "Password",
          type: "password",
          placeholder: " Enter Password",
          size: true,
          validationOptions: {
            required: "password is required",
            minLength: {
              value: 3,
              message: "Minimum 3 characters required",
            },
            maxLength: {
              value: 20,
              message: "Maximum 20 characters allowed",
            },
          },
        },
      ],
    },
  ];
  const handleSubmit = async (formData) => {
    const res = await signIn("credentials", {
      ...formData,
      redirect: false,
    });

    if (res?.error) {
      // ✅ This will now show your API error message!
      toast.error("Login failed", {
        description: "Please check your email and password.",
      });
    } else {
      toast.success("Logged in successfully!");
      redirect("/admin/dashboard");
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold font-grotesk">
                      Welcome back
                    </h1>
                    <p className="text-muted-foreground text-balance font-grotesk">
                      Login to your Acme Inc account
                    </p>
                  </div>
                  <GlobalForm
                    groupedFields={field}
                    onSubmit={handleSubmit}
                    btnName={"Login"}
                  />
                  <div className="flex gap-2 mt-4 font-grotesk text-sm text-center items-center justify-center">
                    Don't have an account?{" "}
                    <Link
                      href={"/auth/register?next=true"}
                      className="text-indigo-600 font-medium underline"
                    >
                      Register here
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-muted relative hidden md:block border-l border-indigo-300">
                <img
                  src="https://cdn.dribbble.com/userupload/11357115/file/original-fb91fc0d58f7a44660d0a5234688b8ed.png?resize=3810x2858&vertical=center"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 font-grotesk">
            By clicking continue, you agree to our{" "}
            <Link href="#" className="text-indigo-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-indigo-600">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
