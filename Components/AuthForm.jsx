"use client";
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function AuthForm() {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !name)) {
      return toast.error("All fields are required.", { autoClose: 3000 });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address.", {
        autoClose: 3000,
      });
    }

    setLoading(true);

    try {
      const ApiEndPoint = `/api/auth/${isLogin ? "login" : "register"}`;
      const data = { email, password, ...(isLogin ? {} : { name }) };
      const response = await axios.post(ApiEndPoint, data);

      if (response?.data?.token) {
        toast.success(
          response.data.message ||
            `${isLogin ? "Login" : "Registration"} successfully!`,
          { autoClose: 3000 }
        );
        try {
          login(response.data.token);
        } catch (loginError) {
          console.error("Login function error:", loginError);
          throw new Error("Failed to update authentication state.");
        }
        setEmail("");
        setPassword("");
        setName("");
        setTimeout(() => router.push("/addtodo"), 3000);
      } else {
        console.error("Unexpected API response:", response.data);
        toast.error(response?.data?.message || "Unexpected error occurred.", {
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Auth Error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        "An error occurred, please try again.";
      toast.error(errorMessage, { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };
  // h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] min-h-[40vh]
  return (
    <div className="flex justify-center items-center h-auto bg-gray-100 px-4 rounded-lg py-10">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-2 rounded-lg shadow-md mt-0">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isLogin ? "Login" : "Register"}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full p-3 border-2 text-gray-700 rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border-2 text-gray-700 rounded-lg focus:ring focus:ring-blue-200"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border-2 text-gray-700 rounded-lg pr-10 focus:ring focus:ring-blue-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <AiOutlineEye size={24} />
              ) : (
                <AiOutlineEyeInvisible size={24} />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-blue-500 hover:underline block text-center"
        >
          {isLogin ? "Need to register?" : "Already have an account?"}
        </button>
      </div>
    </div>
  );
}
