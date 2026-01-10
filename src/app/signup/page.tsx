"use client";

import { signUp } from "@/app/actions/signup";
import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await signUp(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="flex justify-center py-16 p-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-gray-300 dark:border-neutral-800">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>

        <form action={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="displayName"
              className="block text-sm font-medium mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl"
            />
          </div>

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

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              disabled={loading}
              className="w-full border border-emerald-800 dark:text-white py-2 px-4 rounded-xl hover:bg-emerald-900 hover:text-white disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 text-white py-2 px-4 rounded-xl hover:bg-emerald-900 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-200">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
