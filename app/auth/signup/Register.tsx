// "use client";

// import { useState, ChangeEvent, FormEvent } from "react";
// import { useRouter } from "next/navigation"; 
// import Link from "next/link";

// const Register = () => {
//   const [state, setState] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false); // Track loading state
//   const router = useRouter();

//   const onChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setState({ ...state, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     // Validation checks
//     if (!state.name.trim()) return setErrorMessage("Name is required.");
//     if (!/^\S+@\S+\.\S+$/.test(state.email)) return setErrorMessage("Invalid email format.");
//     if (state.password.length < 6) return setErrorMessage("Password must be at least 6 characters.");

//     setErrorMessage(null);
//     setIsLoading(true); // Start loading

//     try {
//       // Register user
//       const response = await fetch("http://localhost:5000/api/user/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(state),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setErrorMessage(errorData.message || "Something went wrong.");
//         return;
//       }

//       const responseData = await response.json();
//       console.log(responseData); // Debugging log

//       if (responseData.success) {
//         // ✅ Redirect user to login page instead of auto-login
//         alert("Registration successful! Please log in.");
//         router.push("/auth/signin");
//       } else {
//         setErrorMessage(responseData.message || "Something went wrong.");
//       }
//     } catch (err) {
//       setErrorMessage("Unexpected error occurred. Please try again.");
//       console.error("Error:", err);
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   return (
//     <div className="flex">
//       <div className="bg-[url('/images/chat.jpg')] bg-no-repeat bg-cover h-screen hidden lg:block lg:w-[40%] xl:w-[60%]"></div>
//       <div className="flex-1 flex h-screen items-center justify-center px-4">
//         <form className="w-[90%]" onSubmit={handleSubmit}>
//           <h1 className="text-xl font-semibold text-white capitalize mb-8">New user? Signup here!</h1>
          
//           {/* Name Input */}
//           <div>
//             <input
//               type="text"
//               name="name"
//               value={state.name}
//               onChange={onChange}
//               placeholder="Name..."
//               className="w-full h-14 rounded-lg outline-none px-4 bg-[#312F2F] text-white"
//             />
//           </div>

//           {/* Email Input */}
//           <div className="mt-6">
//             <input
//               type="email"
//               name="email"
//               value={state.email}
//               onChange={onChange}
//               placeholder="Email..."
//               className="w-full h-14 rounded-lg outline-none px-4 bg-[#312F2F] text-white"
//             />
//           </div>

//           {/* Password Input */}
//           <div className="mt-6">
//             <input
//               type="password"
//               name="password"
//               value={state.password}
//               onChange={onChange}
//               placeholder="Create Password..."
//               className="w-full h-14 rounded-lg outline-none px-4 bg-[#312F2F] text-white"
//             />
//           </div>

//           {/* Submit Button */}
//           <div className="mt-6">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full block cursor-pointer bg-[#00FF38] text-black text-lg font-semibold capitalize h-14 px-4 rounded-lg ${isLoading && 'opacity-50'}`}
//             >
//               {isLoading ? "Signing up..." : "Signup"}
//             </button>
//           </div>

//           {/* Error Message */}
//           {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

//           {/* Login Link */}
//           <Link
//             href="/auth/signin"
//             className="inline-block mt-4 text-zinc-400 font-semibold hover:text-white focus:text-white"
//           >
//             Already have an account?
//           </Link>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;


"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link";

const Register = () => {
  const [state, setState] = useState({ name: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!state.name || !state.email || !state.password) {
      return setErrorMessage("All fields are required.");
    }

    if (!/^\S+@\S+\.\S+$/.test(state.email)) {
      return setErrorMessage("Invalid email format..");
    }

    if (state.password.length < 6) {
      return setErrorMessage("Password must be at least 6 characters.");
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      const responseData = await response.json();
      console.log("📩 Server Response:", responseData);

      if (!response.ok) {
        setErrorMessage(responseData.message || "Something went wrong.");
        return;
      }

      alert("✅ Registration successful! Please log in.");
      router.push("/auth/signin");
    } catch (err) {
      setErrorMessage("Unexpected error occurred. Please try again.");
      console.error("❌ Registration Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="bg-[url('/images/chat.jpg')] bg-cover h-screen hidden lg:block lg:w-[40%] xl:w-[60%]"></div>
      <div className="flex-1 flex h-screen items-center justify-center px-4">
        <form className="w-[90%]" onSubmit={handleSubmit}>
          <h1 className="text-xl font-semibold text-white mb-8">Signup Here!</h1>

          <input type="text" name="name" value={state.name} onChange={onChange} placeholder="Name..." className="w-full h-14 rounded-lg px-4 bg-[#312F2F] text-white" />
          <input type="email" name="email" value={state.email} onChange={onChange} placeholder="Email..." className="w-full h-14 rounded-lg px-4 bg-[#312F2F] text-white mt-4" />
          <input type="password" name="password" value={state.password} onChange={onChange} placeholder="Password..." className="w-full h-14 rounded-lg px-4 bg-[#312F2F] text-white mt-4" />

          <button type="submit" disabled={isLoading} className={`w-full bg-[#00FF38] text-black text-lg font-semibold h-14 px-4 rounded-lg mt-6 ${isLoading && 'opacity-50'}`}>
            {isLoading ? "Signing up..." : "Signup"}
          </button>

          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

          <Link href="/auth/signin" className="inline-block mt-4 text-zinc-400 font-semibold hover:text-white">Already have an account?</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
