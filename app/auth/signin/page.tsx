"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");



  const validateForm = () => {
    const newErrors = { name:"",email: "", password: "" };

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");

  
    try {
      const response = await fetch("https://next-front-esr3elw4d-manali-songires-projects.vercel.app/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      console.log('data.user', data.user)
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("authToken", data.token);
      alert("Login successful!");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="bg-[url('/images/chat.jpg')] bg-no-repeat bg-cover h-screen hidden lg:block lg:w-[50%] xl:w-[65%]"></div>
      <div className="flex-1 flex h-screen items-center justify-center px-4">
        <form className="w-[90%]" onSubmit={handleSubmit}>
          <h1 className="text-xl font-semibold text-white capitalize mb-8">Signin</h1>

          {/* Email Input */}
          <div className="mt-6">
            <input
              type="email"
              placeholder="Email..."
              className="w-full h-14 rounded-lg outline-none px-4 bg-[#312F2F] text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="mt-6">
            <input
              type="password"
              placeholder="Enter Password..."
              className="w-full h-14 rounded-lg outline-none px-4 bg-[#312F2F] text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full block bg-[#00FF38] text-black text-lg font-semibold capitalize h-14 px-4 rounded-lg"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Signup Link */}
          <Link href="/auth/signup" className="inline-block mt-4 text-zinc-400 font-semibold hover:text-white">
            Don&apos;t have an account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
