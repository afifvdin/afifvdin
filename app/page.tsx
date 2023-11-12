import AboutMe from "@/components/AboutMe"
import Experience from "@/components/Experience"
import MyWorks from "@/components/MyWorks"
import Navbar from "@/components/Navbar"
import TechStack from "@/components/TechStack"

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <MyWorks />
      <Experience />
      <TechStack />
      <AboutMe />
    </div>
  )
}
