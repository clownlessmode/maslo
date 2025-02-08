import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ImageCardProps {
  src: string
  size: "sm" | "lg"
  reverse?: boolean
  className?: string
}

const ImageCard: React.FC<ImageCardProps> = ({
  src,
  size = "lg",
  reverse = false,
  className,
}) => {
  const containerClasses = cn(
    "relative w-full bg-background-100 overflow-hidden cursor-pointer",
    "transition-all duration-300",
    size === "sm"
      ? "aspect-square min-h-[42vw] lg:min-h-[24.219vw]"
      : "min-h-[50vw] lg:h-full lg:aspect-auto aspect-square",
    size === "sm"
      ? "rounded-[20px] md:rounded-[20px]"
      : "rounded-[20px] md:rounded-[40px]",
    className
  )

  const imageClasses = cn(
    "bg-cover bg-top transition-all duration-300",
    src,
    reverse
      ? "w-full h-full group-hover:w-4/5 group-hover:h-4/5 " +
          (size === "sm" ? "rounded-[20px]" : "rounded-[40px]")
      : "w-4/5 h-4/5 group-hover:w-full group-hover:h-full " +
          (size === "sm" ? "rounded-[20px]" : "rounded-[40px]")
  )

  // Desktop version
  const DesktopView = (
    <div className={cn(containerClasses, "hidden lg:block group")}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={imageClasses} />
      </div>
    </div>
  )

  // Mobile version with dialog
  const MobileView = (
    <Dialog>
      <DialogTrigger asChild>
        <div className={cn(containerClasses, "block lg:hidden group")}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={imageClasses} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="overflow-hidden fixed max-w-[90vw] md:aspect-video aspect-[9/16] rounded-[20px] md:rounded-[40px]">
        <div className={cn(src, "w-full h-full bg-cover bg-top")} />
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      {DesktopView}
      {MobileView}
    </>
  )
}
export default ImageCard
// return (
//   <>
//     <div
//       className={cn(
//         "relative w-full bg-background-100 overflow-hidden group cursor-pointer hidden lg:block",
//         className,
//         size === "sm"
//           ? "size-full lg:min-h-[24.219vw] min-h-[42vw] aspect-square md:rounded-[20px] rounded-[20px] hidden lg:block"
//           : "lg:h-[100%] min-h-[50vw] aspect-square lg:aspect-auto md:rounded-[40px] rounded-[20px] hidden lg:block"
//       )}
//     >
//       <div className="absolute inset-0 items-center justify-center md:rounded-[40px] rounded-[20px] hidden lg:flex">
//         <div
//           className={cn(
//             "bg-cover bg-top transition-all duration-300 md:rounded-[40px] rounded-[20px] hidden lg:block",
//             src,
//             reverse
//               ? "w-full h-full group-hover:w-4/5  group-hover:h-4/5 hidden lg:block"
//               : "w-4/5 h-4/5  group-hover:w-full group-hover:h-full hidden lg:block"
//           )}
//         />
//       </div>
//     </div>
//     <Dialog>
//       <DialogTrigger asChild className="block lg:hidden">
//         <div
//           className={cn(
//             "relative w-full  bg-background-100 overflow-hidden group cursor-pointer",
//             className,
//             size === "sm"
//               ? "size-full lg:min-h-[24.219vw] min-h-[42vw] aspect-square md:rounded-[20px] rounded-[20px]"
//               : "lg:h-[100%] min-h-[50vw] aspect-square lg:aspect-auto md:rounded-[40px] rounded-[20px]"
//           )}
//         >
//           <div className="absolute inset-0 flex items-center justify-center md:rounded-[40px] rounded-[20px]">
//             <div
//               className={cn(
//                 "bg-cover bg-top transition-all duration-300 md:rounded-[40px] rounded-[20px]",
//                 src,
//                 reverse
//                   ? "w-full h-full group-hover:w-4/5  group-hover:h-4/5"
//                   : "w-4/5 h-4/5  group-hover:w-full group-hover:h-full"
//               )}
//             />
//           </div>
//         </div>
//       </DialogTrigger>
//       <DialogContent className="overflow-hidden md:rounded-[40px] rounded-[20px] fixed md:aspect-video aspect-[9/16] max-w-[90vw]">
//         <div
//           className={cn(src, "w-full h-full object-fit bg-cover bg-top")}
//         />
//       </DialogContent>
//     </Dialog>
//   </>
