"use client";

import { login } from "@/app/actions/login";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await login(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 p-8 rounded-2xl">
        <h1 className="text-2xl font-bold mb-6">Log In</h1>

        <form action={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="mb-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl"
            />
          </div>

          <div className="text-red-800 dark:text-red-500 text-sm mb-8 h-4">
            {error}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-800 text-white py-2 px-4 rounded-xl hover:bg-emerald-900 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-200">
          Don't have an account?{" "}
          <Link href="/signup" className="text-emerald-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
