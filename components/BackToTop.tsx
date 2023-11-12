"use client"

import {
  IconCircleArrowUpFilled,
  IconSquareArrowUpFilled,
} from "@tabler/icons-react"

export default function BackToTop() {
  const doBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center pt-24 pb-4">
      <button onClick={doBackToTop}>
        <IconSquareArrowUpFilled className="h-8 w-8 text-slate-600" />
      </button>
      <p className="text-xs font-circular text-slate-600 font-medium">
        You&apos;ve reached bottom of the page
      </p>
    </div>
  )
}
