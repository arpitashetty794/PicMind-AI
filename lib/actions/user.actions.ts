"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
//export async function getUserById(userId: string) {
//try {
//await connectToDatabase();

//const user = await User.findOne({ clerkId: userId });

//if (!user) throw new Error("User not found");

//return JSON.parse(JSON.stringify(user));
//} catch (error) {
//handleError(error);
//}
//}
// READ + AUTO CREATE IF MISSING
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    // Try to find existing MongoDB user
    let user = await User.findOne({ clerkId: userId });

    // AUTO-CREATE USER IF NOT FOUND
    if (!user) {
      // fetch Clerk user via Clerk API
      const res = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch Clerk user: ${res.status}`);
      }

      const clerkUser = await res.json();

      user = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.email_addresses?.[0]?.email_address || "",
        username: clerkUser.username || clerkUser.id.slice(0, 8),
        photo: clerkUser.image_url || "",
        firstName: clerkUser.first_name || "",
        lastName: clerkUser.last_name || "",
      });
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}


// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true }
    )

    if (!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}