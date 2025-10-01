"use client"

import * as React from "react"
import { Loader } from "lucide-react"

type LoadingSpinnerProps = {
  size?: number
  color?: string
  overlay?: boolean
}

export function LoadingSpinner({
  size = 32,
  color = "text-gray-700",
}: LoadingSpinnerProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <Loader
        className={`animate-spin ${color}`}
        size={size}
        strokeWidth={3}
      />
    </div>
  )
}
