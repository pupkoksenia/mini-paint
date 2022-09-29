export interface savePaint {
  uploadOnDesctop: (createEl: any, canvas: HTMLCanvasElement, NameOfPaint: string) => void
}

export const savePaints: () => savePaint = () => {
  const uploadOnDesctop = (createEl: any, canvas: HTMLCanvasElement, NameOfPaint: string) => {
    createEl.href = canvas.toDataURL()
    createEl.download = NameOfPaint
    createEl.click()
    createEl.remove()
  }

  return {
    uploadOnDesctop,
  }
}
