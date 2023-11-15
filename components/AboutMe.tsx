import { barlow } from "@/app/fonts"
import Link from "next/link"
import BackToTop from "./BackToTop"
import { IconExternalLink } from "@tabler/icons-react"

export default function AboutMe() {
  return (
    <div id="aboutme" className="mt-4 max-w-[96rem] mx-auto py-4 px-4 sm:px-8">
      <div className={barlow.className}>
        <p className="uppercase font-bold text-sm underline tracking-widest">
          About Me
        </p>
        <div className="mt-12 font-circular max-w-2xl">
          <p className="text-5xl wave">👋</p>
          <p className="font-bold text-xl sm:text-3xl md:text-5xl leading-tight">
            Hey there *waves*, my name is Afif, software engineer, mostly
            frontend & mobile dev
          </p>
          <p className="font-normal sm:font-medium mt-8 mb-24 leading-loose">
            I&apos;m passionate about creating seamless connections between
            technology and users. Specializing in frontend and mobile
            development, I excel at building user-friendly interfaces that{" "}
            <span className="underline underline-offset-4">
              bridge the gap between design and functionality
            </span>
            . My commitment to innovation and precision can elevate your digital
            solutions. But enough about me,{" "}
            <span className="underline underline-offset-4">
              how can I assist you?
            </span>
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="mailto:afifudin.fdn@gmail.com"
              className="underline underline-offset-8 font-medium"
            >
              afifudin.fdn@gmail.com
            </Link>
            <Link
              href="https://www.linkedin.com/in/afifudin/"
              target="_blank"
              className="underline underline-offset-8 font-medium"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
      <BackToTop />
    </div>
  )
}
