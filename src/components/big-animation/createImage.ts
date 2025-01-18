const createImage = (src: string, isMobile?: boolean) => {
  const img = document.createElement("img")
  img.src = src

  if (isMobile) {
    img.className = "max-w-full max-h-[300px] object-contain"
  }

  return img
}

export default createImage
