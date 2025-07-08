"use client";
import React from "react";
import { Label } from "../ui/label";

export default function FormLabel({ name, labelText }) {
  return (
    <Label className="text-sm font-medium text-neutral-500" htmlFor={name}>
      {labelText}
    </Label>
  );
}
