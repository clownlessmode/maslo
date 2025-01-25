const createImage = (src: string, isMobile?: boolean) => {
  const img = document.createElement("img")
  img.src = src

  return img
}

export default createImage
