"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"

export default function TechStack() {
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const [multipler, setMultipler] = useState(1)
  const devs = [
    "tailwindcss",
    "react",
    "laravel",
    "nextjs",
    "flutter",
    "mongodb",
    "mysql",
    "sqlite",
    "firebase",
    "googlecloud",
    "nodejs",
    "figma",
    "github",
    "tensorflow",
  ]

  const doHandleResize = () => {
    const currentWidth = window.innerWidth
    const newUpperMultipler = Math.ceil(
      currentWidth / sliderRef.current!.offsetWidth
    )
    setMultipler(newUpperMultipler)
  }

  useEffect(() => {
    if (!sliderRef) return
    doHandleResize()
    window.addEventListener("resize", doHandleResize)
    return () => window.removeEventListener("resize", doHandleResize)
  }, [sliderRef])

  return (
    <div className="mt-4">
      <div className="relative mt-8 mb-12 h-12 sm:h-16 md:h-20 w-full overflow-hidden">
        <div
          className="absolute left-0 top-0 flex items-center px-8 gap-16 w-min techstack-animation-first"
          style={{
            animationDuration: `${multipler * 60}s`,
          }}
          ref={sliderRef}
        >
          {[].concat.apply([], Array(multipler).fill(devs)).map((v, i) => {
            return (
              <div
                key={v + i}
                className="relative h-12 sm:h-16 md:h-20 aspect-square"
              >
                <Image
                  src={`/images/${v}.png`}
                  fill
                  alt="afifcodes"
                  className="object-contain"
                  sizes="auto"
                />
              </div>
            )
          })}
        </div>
        <div
          className="absolute left-0 top-0 flex items-center px-8 gap-16 w-min techstack-animation-second"
          style={{
            animationDuration: `${multipler * 60}s`,
          }}
        >
          {[].concat.apply([], Array(multipler).fill(devs)).map((v, i) => {
            return (
              <div
                key={v + i}
                className="relative h-12 sm:h-16 md:h-20 aspect-square"
              >
                <Image
                  src={`/images/${v}.png`}
                  fill
                  alt="afifcodes"
                  className="object-contain"
                  sizes="auto"
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
