import { Rubik, Barlow, Inter, Plus_Jakarta_Sans } from "next/font/google"

export const rubik = Rubik({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
})

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
})

export const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})
