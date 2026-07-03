import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

import { saveBase64Image } from "@/lib/upload"

export async function POST(req: Request) {
  try {
    const { name, email, password, role, avatarBase64 } = await req.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let avatarUrl = null
    if (avatarBase64) {
      avatarUrl = await saveBase64Image(avatarBase64)
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        avatarUrl
      }
    })

    return NextResponse.json({ message: "User registered successfully", user: { id: user.id, email: user.email, role: user.role } }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
