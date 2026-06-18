import { auth } from "@/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User as UserIcon, Mail, Calendar } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function ProfilePage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and account settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your registered details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
              {user.name?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">CareerPilot User</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 pt-6 border-t">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center">
                <UserIcon className="mr-2 h-4 w-4" /> Full Name
              </span>
              <p className="font-medium">{user.name}</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center">
                <Mail className="mr-2 h-4 w-4" /> Email Address
              </span>
              <p className="font-medium">{user.email}</p>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> Member Since
              </span>
              <p className="font-medium">{user.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
