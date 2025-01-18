const handleDrawCanvas = (
  img: HTMLImageElement,
  ctx: CanvasRenderingContext2D
) => {
  if (!img.complete || img.naturalWidth === 0) {
    return
  }

  const canvas = ctx.canvas
  const widthRatio = canvas.width / img.width
  const heightRatio = canvas.height / img.height
  const ratio = Math.max(widthRatio, heightRatio)
  const centerX = (canvas.width - img.width * ratio) / 2
  const centerY = (canvas.height - img.height * ratio) / 2

  try {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerX,
      centerY,
      img.width * ratio,
      img.height * ratio
    )
  } catch (error) {
    console.error("Ошибка при отрисовке изображения:", error)
  }
}
export default handleDrawCanvas
