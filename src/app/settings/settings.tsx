"use client";

import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "@/components/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { fetchUserData, updateProfile, deleteAccount } from "@/lib/actions";

interface AlertMessage {
  type: "success" | "error";
  text: string;
}

const Settings = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deleteEmail, setDeleteEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [deleteEmailError, setDeleteEmailError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user) {
        try {
          const userData = await fetchUserData({
            email: session.user.email || "",
          });
          setProfile({
            name: userData.data?.name as string,
            email: userData.data?.email as string,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } catch (error: any) {
          console.log(error.response);
          setAlertMessage({
            type: "error",
            text: "Failed to fetch user data.",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session]);

  const handleUpdateProfile = async () => {
    if (profile.newPassword !== profile.confirmPassword) {
      setAlertMessage({
        type: "error",
        text: "New password and confirm password do not match",
      });
      return;
    }

    try {
      setSaving(true);
      const result = await updateProfile(profile);
      setAlertMessage({ type: "success", text: result.message });
    } catch (error: any) {
      setAlertMessage({ type: "error", text: error });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteEmail !== session?.user?.email) {
      setDeleteEmailError("Entered email does not match your current email.");
      return;
    }

    try {
      const result = await deleteAccount();
      setAlertMessage({ type: "success", text: result.message });
      setOpen(false);
      signOut({ callbackUrl: "/login" });
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (error: any) {
      setAlertMessage({ type: "error", text: error });
    }
  };

  return (
    <div className="grid gap-6">
      {loading ? (
        <>
          <Skeleton className="w-full h-[353px] bg-gray-200" />
          <Skeleton className="w-full h-[353px] bg-gray-200" />
        </>
      ) : (
        <>
          {alertMessage && (
            <Alert
              className={`text-${
                alertMessage.type === "success" ? "green" : "red"
              }-600 border-${
                alertMessage.type === "success" ? "green" : "red"
              }-600`}
            >
              <AlertTitle>
                {alertMessage.type === "success" ? "Success!" : "Error!"}
              </AlertTitle>
              <AlertDescription>{alertMessage.text}</AlertDescription>
            </Alert>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View and edit your profile details here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleUpdateProfile} disabled={saving}>
                {saving ? <Spinner /> : "Save"}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
              <CardDescription>
                Secure your account with a new password here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={profile.currentPassword}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={profile.newPassword}
                    onChange={(e) =>
                      setProfile({ ...profile, newPassword: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={profile.confirmPassword}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleUpdateProfile} disabled={saving}>
                {saving ? <Spinner /> : "Save"}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and associated data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Dialog
                  open={open}
                  onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) {
                      setDeleteEmail("");
                      setDeleteEmailError("");
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="w-36 bg-red-600 hover:bg-red-500">
                      Delete Account
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3">
                      <Input
                        id="delete-email"
                        type="email"
                        value={deleteEmail}
                        onChange={(e) => {
                          setDeleteEmail(e.target.value);
                          setDeleteEmailError("");
                        }}
                        className="w-full"
                        placeholder="Email"
                      />
                      {deleteEmailError && (
                        <DialogDescription className="text-red-600">
                          {deleteEmailError}
                        </DialogDescription>
                      )}
                    </div>
                    <div className="flex justify-end gap-4">
                      <DialogClose asChild>
                        <Button variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button
                        className="bg-red-600 hover:bg-red-500"
                        onClick={handleDeleteAccount}
                      >
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Settings;
