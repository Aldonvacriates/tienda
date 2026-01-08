"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { deleteUserAccount, logoutUser, updateUserProfile } from "@/lib/firebase/users";

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, loading, setProfile } = useAuth();
  const [formState, setFormState] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormState({
        name: profile.name ?? "",
        address: profile.address ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setStatus(null);
    try {
      await updateUserProfile(user.uid, formState);
      setProfile({
        ...(profile ?? {
          uid: user.uid,
          email: user.email ?? "",
          createdAt: "",
          updatedAt: "",
        }),
        ...formState,
      });
      setStatus("Profile updated.");
    } catch (error) {
      console.error(error);
      setStatus("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  const handleDelete = async () => {
    if (!user) return;
    const confirmed = window.confirm(
      "Delete your account and all profile data? This cannot be undone."
    );
    if (!confirmed) return;
    try {
      await deleteUserAccount(user);
      router.push("/");
    } catch (error) {
      console.error(error);
      setStatus("Unable to delete account. Please re-authenticate.");
    }
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <p className="text-sm text-neutral-500">Loading account...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <h1 className="mb-4 text-3xl font-bold">Your account</h1>
        <p className="mb-6 text-sm text-neutral-600">
          Sign in to view your profile and order history.
        </p>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold"
          >
            Create account
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your account</h1>
        <button
          onClick={handleLogout}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold"
        >
          Sign out
        </button>
      </div>
      <div className="rounded-lg border border-neutral-200 p-6">
        <p className="mb-6 text-sm text-neutral-600">
          Signed in as <span className="font-semibold">{user.email}</span>
        </p>
        <form onSubmit={handleSave} className="space-y-4">
          <label className="block text-sm font-medium">
            Full name
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium">
            Address
            <input
              type="text"
              name="address"
              value={formState.address}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium">
            Phone
            <input
              type="text"
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
          {status ? (
            <p className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
              {status}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/orders"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold"
        >
          View order history
        </Link>
        <button
          onClick={handleDelete}
          className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600"
        >
          Delete account
        </button>
      </div>
    </main>
  );
}
