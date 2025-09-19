// // app/forgot-password/page.tsx
"use client";

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const email = e.currentTarget.email.value;

          const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();
          alert(data.message || data.error);
        }}
      >
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
