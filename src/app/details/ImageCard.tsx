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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "relative w-full rounded-[40px] bg-background-100 overflow-hidden group cursor-pointer",
            className,
            size === "sm"
              ? //   ? "xl:size-[24.219vw] size-[42vw]"
                "size-full lg:min-h-[24.219vw] min-h-[42vw] aspect-square"
              : "lg:h-[100%] min-h-[50vw] aspect-square lg:aspect-auto"
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center rounded-[40px]">
            <div
              className={cn(
                "bg-cover bg-top transition-all duration-300 rounded-[40px]",
                src,
                reverse
                  ? "w-full h-full group-hover:w-4/5  group-hover:h-4/5"
                  : "w-4/5 h-4/5  group-hover:w-full group-hover:h-full"
              )}
            />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className=" overflow-hidden rounded-[40px] fixed md:aspect-video aspect-[9/16] max-w-[90vw]">
        <div className={cn(src, "w-full h-full object-fit bg-cover bg-top")} />
      </DialogContent>
    </Dialog>
  )
}
export default ImageCard
