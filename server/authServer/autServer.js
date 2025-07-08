"use server";

import { connect } from "@/db/db";
import { comparePassword, hashPassword } from "@/helper/bcryptPassword";
import { trimWhitespace } from "@/helper/trim";
import UserModel from "@/models/userModel";

export async function register(params) {
  try {
    // first we have sanitize the input
    const sanitizedEmail = trimWhitespace(params.email.toLowerCase());
    const name = trimWhitespace(params.name);

    if (!name || !sanitizedEmail || !params.password) {
      return { success: false, message: "All fields are required" };
    }

    await connect();

    // check if the email is alreday registered
    const existingUser = await UserModel.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return { success: false, message: "Email already registered" };
    }

    const hashedPassword = hashPassword(params.password);

    // create a new user
    const newUser = new UserModel({
      name: name,
      email: sanitizedEmail,
      password: hashedPassword,
      role: "user", // after admin register we will to do user here reminder todo
    });
    await newUser.save();
    return { success: true, message: "Registration successful" };
  } catch (error) {
    console.log("Error in register function", error);
    return {
      success: false,
      message: "Registration failed. Please try again.",
    };
  }
}

export async function login(params) {
  try {
    const sanitizedEmail = trimWhitespace(params.email.toLowerCase());
    if (sanitizedEmail === "" || params.password === "") {
      return { success: false, message: "All fields are required" };
    }

    await connect();

    // check if the user exists
    const user = await UserModel.findOne({ email: sanitizedEmail });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    // check if the password is correct
    const isPasswordValid = comparePassword(params.password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid password" };
    }
    // if everything is fine, return the user
    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.log("Error in login function", error);
    return { success: false, message: "Login failed. Please try again." };
  }
}
