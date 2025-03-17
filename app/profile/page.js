"use client";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext.js";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const { token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const { name, email } = response.data;
        setUser({ name, email });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        }
      });
  }, [token, router]);

  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-900 dark:text-white">
        Loading...
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="font-semibold">
        <strong>Name:</strong> {user.name}
      </p>
      <p className="font-semibold mt-2">
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
}