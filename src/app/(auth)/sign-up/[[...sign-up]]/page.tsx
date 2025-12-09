import { SignUp } from "@clerk/nextjs";
import { CommonAuthSkeleton } from "@/components/authentication/common-auth-skeleton";

export default function SignUpPage() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center overflow-hidden px-4 mt-3">
      <div className="w-full max-w-md px-4">
        <div className="mb-6 flex flex-col gap-1 text-center">
          <h1 className="text-xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground">
            Join PresentPerfect and start creating amazing presentations
          </p>
        </div>
        <div className="rounded-lg border border-border/50 bg-background/40 backdrop-blur-sm p-2">
          <SignUp
            fallback={<CommonAuthSkeleton />}
            appearance={{
              elements: {
                headerTitle: "hidden",
              },
            }}
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}
