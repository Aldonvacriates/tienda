"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { registerUser } from "@/lib/firebase/users";

export default function RegisterPage() {
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await registerUser({
        email: formState.email,
        password: formState.password,
        name: formState.name,
        address: formState.address,
        phone: formState.phone,
      });
      router.push("/account");
    } catch (error) {
      setStatus("Registration failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Create account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium">
          Full name
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            placeholder="Aldo Sample"
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            placeholder="********"
            required
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
            placeholder="123 Main Street"
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
            placeholder="(555) 123-4567"
          />
        </label>
        {status ? (
          <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
            {status}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-neutral-600">
        Already have an account?{" "}
        <Link className="font-semibold text-blue-600" href="/login">
          Sign in
        </Link>
      </p>
    </main>
  );
}
