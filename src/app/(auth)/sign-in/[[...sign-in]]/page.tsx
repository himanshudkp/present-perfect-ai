import { CommonAuthSkeleton } from "@/components/common-auth-skeleton";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center overflow-hidden px-4">
      <div className="w-full max-w-md">
        <div className="mb-4 flex flex-col gap-1 text-center">
          <h1 className="text-xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your presentations
          </p>
        </div>

        <div className="rounded-lg border border-border/50 bg-background/40 backdrop-blur-sm p-2">
          <SignIn fallback={<CommonAuthSkeleton />} />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Don't have an account?{" "}
          <a
            href="/sign-up"
            className="text-primary hover:underline font-semibold"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
