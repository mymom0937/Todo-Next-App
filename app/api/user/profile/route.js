// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { connectDB } from "@/app/lib/config/db"; // Import database connection
// import UserModel from "@/app/lib/models/UserModel"; // Import the User model

// export async function GET(request) {
//   try {
//     const token = request.headers.get("Authorization")?.split(" ")[1]; // Extract the token from the header
//     if (!token) {
//       return NextResponse.json(
//         { message: "No token provided. Please log in." },
//         { status: 401 }
//       );
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
//     await connectDB(); // Connect to the database

//     const user = await UserModel.findById(decoded.id); // Find the user by ID in the database
//     if (!user) {
//       return NextResponse.json({ message: "User not found." }, { status: 404 });
//     }

//     // Return user data including name, email, and any other details
//     // console.log("Fetched user:", user);
//     return NextResponse.json({ name: user.name, email: user.email });
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     return NextResponse.json(
//       { message: "Invalid token or authentication error." },
//       { status: 401 }
//     );
//   }
// }


// app/api/user/profile/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/config/db";
import UserModel from "@/app/lib/models/UserModel";

export async function GET(request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "No valid token provided. Please log in." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "Token missing in Authorization header." },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return NextResponse.json(
        { message: "Invalid token payload." },
        { status: 401 }
      );
    }

    // Connect to database and fetch user
    await connectDB();
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Return user data
    return NextResponse.json({ name: user.name, email: user.email }, { status: 200 });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return NextResponse.json(
      { message: "Invalid token or authentication error." },
      { status: 401 }
    );
  }
}