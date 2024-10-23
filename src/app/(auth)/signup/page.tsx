"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Github, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FormValues {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export default function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`/api/signup`, values);
      toast({
        title: "Registered",
        description: response.data.message,
        variant: "default",
      });

      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.ok) {
        router.replace("/explore");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.id]: e.target.value });
  };

  return (
    <div className="flex px-2 items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                      placeholder="Kush Chaudhary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={values.role}
                      onValueChange={(value) =>
                        setValues({ ...values, role: value })
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select Role</SelectLabel>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="kushchaudhary@gmail.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" />
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
