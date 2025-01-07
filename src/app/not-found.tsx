import { Button } from "@/components/ui/button"
import VisualNotFoundHeading from "@/components/visual/not-found-heading"
import Link from "next/link"

function NotFoundPage() {
  return (
    <div className="pt-[95px] min-h-screen flex items-center flex-col gap-y-[42px] pb-[160px]">
      <VisualNotFoundHeading className="xl:w-[889px] h-auto" />
      <span className="text-2xl uppercase">такая страница не найдена :(</span>
      <Button
        className="max-h-[60px] max-w-[345px] xl:max-h-[114px] w-full xl:max-w-[348px] !rounded-[30px]"
        variant="default_v2"
        size="lg"
        asChild
      >
        <Link href="/">на главную</Link>
      </Button>
    </div>
  )
}

export default NotFoundPage
