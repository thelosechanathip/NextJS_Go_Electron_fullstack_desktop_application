"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import DbSetupDialog from "@/components/DbSetupDialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const { checkDbStatus, isLoading } = useAppStore();

  useEffect(() => {
    checkDbStatus();
  }, []);

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      {/* Dialog จะเด้งขึ้นมาเองถ้า Backend บอกว่ายังไม่ Setup */}
      <DbSetupDialog />

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login System</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Password" />
            </div>
            <Button className="w-full mt-4">Login</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}