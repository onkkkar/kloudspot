import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[url('/images/bg.png')] bg-cover bg-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* content */}
      <div className="relative z-10 flex h-81.5 w-277.5 items-center justify-between">
        {/* Left Title */}
        <div className="h-20 w-107 font-sans text-[32px] leading-10 font-semibold tracking-[0.02em] text-white">
          Welcome to the <br /> Crowd Management System{" "}
        </div>

        {/* Right Login Form */}
        <div className="h-81.5 w-90 overflow-hidden rounded-xl bg-white">
          {/* Title */}
          <div className="from-primary-black to-primary-green flex h-27.5 items-center justify-center rounded-t-xl bg-linear-to-br">
            {/* Wrapper */}
            <div className="flex h-10 w-31.5 items-center justify-center gap-1 text-xl font-semibold text-white">
              {/* Logo */}
              <div>
                <img src="/images/logo.png" alt="logo" className="h-8 w-6" />
              </div>
              {/* Content  */}
              <div>kloudspot</div>
            </div>
          </div>

          {/* Login Creds */}
          <div className="px-10 py-2">
            <div className="space-y-1">
              {/* Username */}
              <div>
                <label
                  htmlFor="login"
                  className="block text-sm text-[#0D0D0DE5]/90"
                >
                  LogIn
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-2"
                />
              </div>
              {/* Password */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm text-[#0D0D0DE5]/90"
                >
                  Password
                </label>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-2 pr-10"
                />

                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-8.5 right-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    /* eye-off */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                      <path d="m2 2 20 20" />
                    </svg>
                  ) : (
                    /* eye */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Login Button */}{" "}
              <button className="mt-2 h-10 w-full rounded-lg bg-[#009490] font-sans text-white">
                {" "}
                Login{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
