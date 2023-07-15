"use client";
import React, { FC, useState } from "react";
import Button from "./ui/button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddFriendButtonProps { }
type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({ }) => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });
  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });
      await axios.post("/api/friends/add", { email: validatedEmail });
      setShowSuccessState(false);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError("email", { message: e.message });
        return;
      }

      if (e instanceof AxiosError) {
        setError("email", { message: e.response?.data });
        return;
      }
      setError("email", { message: "Something went wrong" });
    }
  };
  return (
    <form
      onSubmit={handleSubmit((data: FormData) => {
        addFriend(data.email);
      })}
      className="max-w-sm"
    >
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-950"
      >
        Add Friend By Email
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          placeholder="you@example.com"
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-700">{errors.email?.message}</p>
      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-700">Friend request sent</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;
