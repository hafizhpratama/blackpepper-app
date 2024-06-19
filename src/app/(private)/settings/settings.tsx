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
import { z } from "zod";

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
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deleteEmail, setDeleteEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const [profileErrors, setProfileErrors] = useState<{
    name?: string;
    email?: string;
  }>({});
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
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

  const profileSchema = z.object({
    name: z.string().nonempty("Name is required"),
    email: z
      .string()
      .email("Invalid email format")
      .nonempty("Email is required"),
  });

  const passwordSchema = z.object({
    currentPassword: z.string().nonempty("Current password is required"),
    newPassword: z.string().nonempty("New password is required"),
    confirmPassword: z
      .string()
      .nonempty("Confirm password is required")
      .refine((value) => value === password.newPassword, {
        message: "Passwords must match",
      }),
  });

  const validateProfile = async () => {
    try {
      profileSchema.parse(profile);
      setProfileErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        err.errors.forEach((validationError) => {
          if (validationError.path) {
            errors[validationError.path[0]] = validationError.message;
          }
        });
        setProfileErrors(errors);
      }
      return false;
    }
  };

  const validatePassword = async () => {
    try {
      passwordSchema.parse(password);
      setPasswordErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        err.errors.forEach((validationError) => {
          if (validationError.path) {
            errors[validationError.path[0]] = validationError.message;
          }
        });
        setPasswordErrors(errors);
      }
      return false;
    }
  };

  const handleUpdateProfile = async () => {
    if (!(await validateProfile())) {
      return;
    }

    try {
      setSavingProfile(true);
      const result = await updateProfile(profile);
      setAlertMessage({ type: "success", text: result.message });
    } catch (error: any) {
      setAlertMessage({ type: "error", text: error.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!(await validatePassword())) {
      return;
    }

    try {
      setSavingPassword(true);
      const result = await updateProfile(password);
      setAlertMessage({ type: "success", text: result.message });
    } catch (error: any) {
      setAlertMessage({ type: "error", text: error.message });
    } finally {
      setSavingPassword(false);
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
      setAlertMessage({ type: "error", text: error.message });
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
                  {profileErrors.name && (
                    <div className="text-red-600 text-sm">
                      {profileErrors.name}
                    </div>
                  )}
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
                  {profileErrors.email && (
                    <div className="text-red-600 text-sm">
                      {profileErrors.email}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleUpdateProfile} disabled={savingProfile}>
                {savingProfile ? <Spinner /> : "Save"}
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
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={password.currentPassword}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                  {passwordErrors.currentPassword && (
                    <div className="text-red-600 text-sm">
                      {passwordErrors.currentPassword}
                    </div>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={password.newPassword}
                    onChange={(e) =>
                      setPassword({ ...password, newPassword: e.target.value })
                    }
                    className="w-full"
                  />
                  {passwordErrors.newPassword && (
                    <div className="text-red-600 text-sm">
                      {passwordErrors.newPassword}
                    </div>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={password.confirmPassword}
                    onChange={(e) =>
                      setPassword({
                        ...password,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                  {passwordErrors.confirmPassword && (
                    <div className="text-red-600 text-sm">
                      {passwordErrors.confirmPassword}
                    </div>
                  )}
                </div>
                {alertMessage?.type === "error" && (
                  <div className="text-red-600 text-sm">
                    {alertMessage.text}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleUpdatePassword} disabled={savingPassword}>
                {savingPassword ? <Spinner /> : "Save"}
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
