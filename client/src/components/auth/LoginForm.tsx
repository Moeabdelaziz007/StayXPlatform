import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { loginWithEmail, signInWithGoogle, isProcessing } = useAuth();
  const [, setLocation] = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null);
    try {
      await loginWithEmail(data.email, data.password);
      setLocation("/");
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to sign in");
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      await signInWithGoogle();
      setLocation("/");
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to sign in with Google");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-[#2A2A2A] bg-[#1E1E1E]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in to StayX</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full border-[#2A2A2A] hover:border-neon-green hover:bg-neon-green/10"
            onClick={handleGoogleSignIn}
            disabled={isProcessing}
          >
            <i className="ri-google-fill mr-2"></i>
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-[#2A2A2A]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1E1E1E] text-gray-medium">or continue with</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        {...field}
                        className="bg-[#2A2A2A] border-[#2A2A2A] focus:border-neon-green"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="bg-[#2A2A2A] border-[#2A2A2A] focus:border-neon-green"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}
              <Button
                type="submit"
                className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                disabled={isProcessing}
              >
                {isProcessing ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-gray-medium">
          Don't have an account?{" "}
          <Link href="/register" className="text-neon-green hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
