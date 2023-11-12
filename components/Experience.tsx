import { barlow } from "@/app/fonts";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function Experience() {
  return (
    <div>
      <div
        className={
          "mt-4 max-w-[96rem] mx-auto py-4 px-4 sm:px-8 " + barlow.className
        }
      >
        <p className="uppercase italic text-4xl">Recent Projects</p>
      </div>
      <div className="flex flex-col lg:grid grid-cols-3 w-full lg:h-[28rem] gap-8 py-4 px-4 sm:px-8">
        <div className="relative aspect-square lg:aspect-auto">
          <Image
            src="/images/lenjhelenan.png"
            fill
            alt="afifcodes"
            sizes="auto"
            className="object-cover"
          />
          <Button url="https://xlenjhelenan.vercel.app">Lenjhelenan</Button>
        </div>
        <div className="relative aspect-square lg:aspect-auto">
          <Image
            src="/images/unvolds-web.png"
            fill
            alt="afifcodes"
            sizes="auto"
            className="object-cover"
          />
          <Button url="https://unvolds.vercel.app" invert>
            Unvolds
          </Button>
        </div>
        <div className="relative aspect-square lg:aspect-auto">
          <Image
            src="/images/dovtron.png"
            fill
            alt="afifcodes"
            sizes="auto"
            className="object-cover"
          />
          <Button url="https://play.google.com/store/apps/details?id=com.nanx_studio.dovtron">
            Dovtron
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ButtonInterface {
  invert?: boolean;
  url: string;
  children: React.ReactNode;
}

const Button = ({ invert, url, children }: ButtonInterface) => {
  return (
    <div className="uppercase text-sm absolute top-0 left-0 w-full h-full flex flex-col items-center justify-end p-8">
      <Link
        href={url}
        target="_blank"
        className={`transition-all px-4 py-2.5 flex items-center justify-center gap-4 hover:gap-6 relative ${
          invert ? "bg-white text-neutral-900" : "bg-neutral-900 text-white"
        }`}
      >
        <div
          className={`absolute left-0.5 top-0.5 w-full h-full border ${
            invert ? "border-white" : "border-neutral-900"
          }`}
        />
        <span>{children}</span>
        <IconArrowNarrowRight className="h-6 w-6" />
      </Link>
    </div>
  );
};
