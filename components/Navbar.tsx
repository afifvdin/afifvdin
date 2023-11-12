"use client"

import Image from "next/image"
import Link from "next/link"
import { MouseEvent, useEffect, useState } from "react"
import { IconMenu2, IconDownload, IconX } from "@tabler/icons-react"

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const [animateMenu, setAnimateMenu] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  const doShowMenu = () => {
    document.body.style.overflow = "hidden"
    setShowMenu(true)
  }

  const doCloseMenu = () => {
    document.body.style.overflow = "auto"
    setAnimateMenu(false)
  }

  const doStopPropagation = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  useEffect(() => {
    if (showMenu) {
      setAnimateMenu(true)
    }
  }, [showMenu])

  useEffect(() => {
    if (!animateMenu) {
      setTimeout(() => {
        setShowMenu(false)
      }, 300)
    }
  }, [animateMenu])

  const doHandleScroll = () => {
    const currentScrollPos = window.scrollY

    if (currentScrollPos > prevScrollPos) {
      setVisible(false)
    } else {
      setVisible(true)
    }

    setPrevScrollPos(currentScrollPos)
  }

  useEffect(() => {
    window.addEventListener("scroll", doHandleScroll)
    return () => window.removeEventListener("scroll", doHandleScroll)
  }, [prevScrollPos])

  return (
    <>
      <div
        className={`transition-all duration-500 sticky z-40 top-0 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-8 sm:px-16 py-3 sm:py-0 flex justify-between sm:grid grid-cols-3 items-center border-b bg-white">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <Image
              alt="afifcodes"
              src="/images/logo.png"
              fill
              sizes="auto"
              className="object-contain"
            />
          </div>
          <div className="hidden sm:flex items-center justify-center gap-4 whitespace-nowrap pt-8 uppercase text-sm">
            <Link
              href="#experiences"
              className="h-11 py-3 border-b-0 hover:border-b-4 border-b-black transition-all"
            >
              Experiences
            </Link>
            <Link
              href="#aboutme"
              className="h-11 py-3 border-b-0 hover:border-b-4 border-b-black transition-all"
            >
              About Me
            </Link>
          </div>
          <div className="flex justify-end items-center">
            <button
              onClick={doShowMenu}
              className="aspect-square p-2 -mr-2 sm:hidden"
            >
              <IconMenu2 className="h-4 w-4" />
            </button>
            <Link href="/CV Afifudin - FrontEnd Developer.pdf" target="_blank" className="hidden sm:flex items-center justify-center gap-2 py-0.5 px-3 text-sm bg-neutral-200 hover:bg-neutral-100 transition-all">
              <IconDownload className="h-3 w-3" />
              <span>Resume</span>
            </Link>
          </div>
        </div>
      </div>
      <div
        onClick={doCloseMenu}
        className={`${!showMenu ? "hidden" : "fixed"} ${
          !animateMenu ? "bg-opacity-0" : "bg-opacity-25"
        } transition-all duration-300 left-0 top-0 z-50 h-screen w-screen bg-black`}
      >
        <div
          onClick={doStopPropagation}
          className={`${
            !animateMenu ? "-translate-y-full" : "translate-y-0"
          } bg-white transition-all duration-300`}
        >
          <div className="flex items-center justify-end p-4">
            <button className="aspect-square p-2 -mr-2" onClick={doCloseMenu}>
              <IconX />
            </button>
          </div>
          <Link
            href="#experiences"
            className="block p-2 text-center bg-white hover:bg-neutral-200 transition-all"
          >
            Experiences
          </Link>
          <Link
            href="#aboutme"
            className="block p-2 text-center bg-white hover:bg-neutral-200 transition-all"
          >
            About Me
          </Link>
          <Link href="/CV Afifudin - FrontEnd Developer.pdf" target="_blank" className="w-full p-2 flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 transition-all">
            <span>Resume</span>
            <IconDownload className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  )
}
