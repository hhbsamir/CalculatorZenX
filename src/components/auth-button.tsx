
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return <Button variant="outline" className="w-full">Loading...</Button>;
  }

  if (user) {
    return (
      <div className="flex items-center justify-between w-full p-2 rounded-lg bg-secondary">
        <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-secondary-foreground truncate">{user.displayName || "Authenticated"}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={signOut} className="text-secondary-foreground hover:bg-secondary/80">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={signInWithGoogle} className="w-full">
      <LogIn className="mr-2 h-5 w-5" />
      Sign in
    </Button>
  );
}
