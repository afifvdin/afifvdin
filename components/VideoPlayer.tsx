"use client"

import { useRef } from "react"

type VideoPlayerProps = {
  className: string
  video_url: string
}

const VideoPlayer = ({ className, video_url }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const doMouseEnter = () => {
    videoRef.current!.play()
  }

  const doMouseLeave = () => {
    videoRef.current!.pause()
    videoRef.current!.currentTime = 0
  }
  return (
    <div
      className={"relative " + className}
      onMouseEnter={doMouseEnter}
      onMouseLeave={doMouseLeave}
    >
      <video
        muted
        loop
        playsInline
        ref={videoRef}
        className="object-cover h-full w-full"
      >
        <source src={video_url} type="video/mp4" />
      </video>
    </div>
  )
}
