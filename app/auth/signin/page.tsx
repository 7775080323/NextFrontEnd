// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";


// const Login = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");



//   const validateForm = () => {
//     const newErrors = { name:"",email: "", password: "" };

//     if (!email) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

//     if (!password) newErrors.password = "Password is required";
//     else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

//     setErrors(newErrors);
//     return Object.values(newErrors).every((err) => err === "");
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     setErrorMessage("");

  
//     try {
//       const response = await fetch("https://nextbackend-d5ze.onrender.com/auth/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Invalid credentials");
//       }

//       console.log('data.user', data.user)
//       localStorage.setItem("user", JSON.stringify(data.user));
//       localStorage.setItem("authToken", data.token);
//       alert("Login successful!");
//       router.push("/");
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setErrorMessage(error.message);
//       } else {
//         setErrorMessage("An unexpected error occurred");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex">
//       <div className="bg-[url('/images/chat.jpg')] bg-no-repeat bg-cover h-screen hidden lg:block lg:w-[50%] xl:w-[65%]"></div>
//       <div className="flex-1 flex h-screen items-center justify-center px-4">
//         <form className="w-[90%]" onSubmit={handleSubmit}>
//           <h1 className="text-xl font-semibold text-white capitalize mb-8">Signin</h1>

//           {/* Email Input */}
//           <div className="mt-6">
//             <input
//               type="email"
//               placeholder="Email..."
//               className="w-full h-14 rounded-lg outline-none px-4 bg-[#312F2F] text-white"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//           </div>

//           {/* Password Input */}
//           <div className="mt-6">
//             <input
//               type="password"
//               placeholder="Enter Password..."
//               className="w-full h-14 rounded-lg outline-none px-4 bg-[#312F2F] text-white"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//           </div>

//           {/* Error Message */}
//           {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

//           {/* Submit Button */}
//           <div className="mt-6">
//             <button
//               type="submit"
//               className="w-full block bg-[#00FF38] text-black text-lg font-semibold capitalize h-14 px-4 rounded-lg"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </div>

//           {/* Signup Link */}
//           <Link href="/auth/signup" className="inline-block mt-4 text-zinc-400 font-semibold hover:text-white">
//             Don&apos;t have an account?
//           </Link>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const [state, setState] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!state.email || !state.password) {
      return setErrorMessage("All fields are required.");
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send cookies
        body: JSON.stringify(state),
      });

      const responseData = await response.json();
      console.log("📩 Server Response:", responseData);

      if (!response.ok) {
        setErrorMessage(responseData.message || "Invalid credentials.");
        return;
      }

      alert("✅ Login successful!");
      router.push("/chat"); // Redirect to chat page
    } catch (err) {
      setErrorMessage("Unexpected error occurred. Please try again.");
      console.error("❌ Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="bg-[url('/images/chat.jpg')] bg-cover h-screen hidden lg:block lg:w-[40%] xl:w-[60%]"></div>
      <div className="flex-1 flex h-screen items-center justify-center px-4">
        <form className="w-[90%]" onSubmit={handleSubmit}>
          <h1 className="text-xl font-semibold text-white mb-8">Login Here!</h1>

          <input type="email" name="email" value={state.email} onChange={onChange} placeholder="Email..." className="w-full h-14 rounded-lg px-4 bg-[#312F2F] text-white" />
          <input type="password" name="password" value={state.password} onChange={onChange} placeholder="Password..." className="w-full h-14 rounded-lg px-4 bg-[#312F2F] text-white mt-4" />

          <button type="submit" disabled={isLoading} className={`w-full bg-[#00FF38] text-black text-lg font-semibold h-14 px-4 rounded-lg mt-6 ${isLoading && 'opacity-50'}`}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

          <Link href="/auth/signup" className="inline-block mt-4 text-zinc-400 font-semibold hover:text-white">Don't have an account? Sign up</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
