"use client"

import { barlow } from "@/app/fonts"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Swiper, SwiperSlide } from "swiper/react"
import {
  Navigation,
  Pagination,
  Scrollbar,
  Mousewheel,
  Keyboard,
} from "swiper/modules"
import {
  IconChevronRight,
  IconChevronLeft,
  IconWorldWww,
  IconDeviceLaptop,
  IconBrandAndroid,
} from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"

export default function MyWorks() {
  return (
    <div
      id="experiences"
      className="mt-4 max-w-[96rem] mx-auto py-4 px-4 sm:px-8"
    >
      <div className={barlow.className}>
        <p className="uppercase font-bold text-sm underline tracking-widest">
          Experiences
        </p>
        <p className="uppercase italic text-4xl">My Works</p>
      </div>
      <div className="py-4 relative">
        <button className="absolute left-0 top-1/2 z-10 aspect-square p-3 duration-500 opacity-100 transition-all border border-black bg-white text-black cursor-pointer swiper-button-custom-prev">
          <IconChevronLeft className="h-7 w-7" />
        </button>
        <button className="absolute right-0 top-1/2 z-10 aspect-square p-3 duration-500 opacity-100 transition-all border border-black bg-white text-black cursor-pointer swiper-button-custom-next">
          <IconChevronRight className="h-7 w-7" />
        </button>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, Mousewheel, Keyboard]}
          navigation={{
            nextEl: `.swiper-button-custom-next`,
            prevEl: `.swiper-button-custom-prev`,
            disabledClass: "!opacity-0 !pointer-events-none !cursor-none",
          }}
          scrollbar={{ draggable: true }}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          pagination={{
            el: ".swiper-pagination-custom",
            clickable: true,
            bulletClass:
              "!border-b-black !border-b hover:!border-b-4 !h-2 !w-5 !bg-transparent !mx-0.5 !block !cursor-pointer !transition-all",
            bulletActiveClass: "!border-b-4",
          }}
          mousewheel
          spaceBetween={32}
          slidesPerView={4.7}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
              spaceBetween: 8,
            },
            400: {
              slidesPerView: 1.7,
              spaceBetween: 8,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 8,
            },
            768: {
              slidesPerView: 2.7,
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 3.7,
              spaceBetween: 18,
            },
            1280: {
              slidesPerView: 4.7,
              spaceBetween: 32,
            },
          }}
        >
          <SwiperSlide>
            <Card
              title="Lenjhelenan"
              desc="Traveloka-like website exclusive for madura island."
              image_url="/images/lenjhelenan.png"
              link="https://xlenjhelenan.vercel.app"
              platform={["web"]}
            />
          </SwiperSlide>
          <SwiperSlide>
            <Card
              title="FutureMinded"
              desc="Community helper app to help picking college majors."
              image_url="/images/futureminded.png"
              link="https://github.com/futmin/androidapp"
              platform={["android"]}
            />
          </SwiperSlide>
          <SwiperSlide>
            <Card
              title="Unvolds"
              desc="UNet VGG-19 based lung detection software on digital x-ray images."
              image_url="/images/unvolds-web.png"
              link="https://unvolds.vercel.app"
              platform={["web", "desktop", "android"]}
            />
          </SwiperSlide>
          <SwiperSlide>
            <Card
              title="Dovtron"
              desc="Disease detection applicationn on corn leaves."
              image_url="/images/dovtron.png"
              link="https://play.google.com/store/apps/details?id=com.nanx_studio.dovtron"
              platform={["android"]}
            />
          </SwiperSlide>
          <SwiperSlide>
            <Card
              title="LabTI"
              desc="Loan manager for industrial engineering lab."
              image_url="/images/labti.png"
              link="https://labti.vercel.app"
              platform={["web"]}
            />
          </SwiperSlide>
          <SwiperSlide>
            <Card
              title="Devid"
              desc="VGG-based lung detection app based on digital x-ray images."
              image_url="/images/devid.png"
              link="https://play.google.com/store/apps/details?id=com.utm.teknik.devid"
              platform={["android"]}
            />
          </SwiperSlide>
        </Swiper>
        <div className="swiper-pagination-custom flex items-end justify-center p-2 h-12"></div>
      </div>
    </div>
  )
}

type CardPropsType = {
  title: string
  desc: string
  image_url: string
  link: string
  platform: string[]
}

const Card = ({ title, desc, image_url, link, platform }: CardPropsType) => {
  return (
    <div className="h-full flex flex-col cursor-pointer">
      <div className="aspect-[4/5] relative">
        <Image
          src={image_url}
          alt="afifcodes"
          className="object-cover"
          fill
          sizes="auto"
        />
      </div>
      <p className="mt-4 font-medium flex items-center gap-2">
        <span>{title}</span>
        {platform.includes("web") && (
          <IconWorldWww className="h-4 w-4 text-neutral-500" />
        )}
        {platform.includes("desktop") && (
          <IconDeviceLaptop className="h-4 w-4 text-neutral-500" />
        )}
        {platform.includes("android") && (
          <IconBrandAndroid className="h-4 w-4 text-neutral-500" />
        )}
      </p>
      <div className="flex-grow flex flex-col justify-between">
        <p className="text-sm mt-2 mb-4">{desc}</p>
        <Link
          href={link}
          target="_blank"
          className="w-min underline underline-offset-1 hover:underline-offset-4 transition-all font-medium"
        >
          Visit
        </Link>
      </div>
    </div>
  )
}
