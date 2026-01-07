"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [address, setAddress] = useState("");

  const router = useRouter();
  const supabase = createClient(); // get Supabase client

  const handleSignup = async () => {
    // Basic validation
    if (!name || !email || !password || !phone || !birthdate || !address) {
      alert("Please fill in all fields");
      return;
    }

    // 1️⃣ Sign up in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone_number: phone,
          birthdate,
          address,
        },
      },
    });

    if (signUpError) {
      alert(signUpError.message);
      return;
    }

    const userId = signUpData.user?.id;
    if (!userId) {
      alert("Something went wrong. No user ID returned.");
      return;
    }

    // 2️⃣ Insert profile in profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId, // link profile to auth user
        full_name: name,
        display_name: name,
        phone: phone,
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
      alert("Signup succeeded but profile creation failed.");
      return;
    }

    // Success
    alert("Signup successful! Check your email to confirm your account.");
    router.push("/login");
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "5vh",
        backgroundColor: "#f7f7f7",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          flexShrink: 0,
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "1rem", fontWeight: 500 }}>
          Sign Up
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
        />
        <input
          type="date"
          placeholder="Birthdate"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
        />

        <Button onClick={handleSignup} size="lg" style={{ backgroundColor: "#6b46c1", color: "#fff" }}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}
