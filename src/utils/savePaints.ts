export interface savePaint {
  saveImageOnComp: (
    createEl: any,
    canvas: HTMLCanvasElement,
    NameOfPaint: string
  ) => void;
}

export const savePaints: () => savePaint = () => {
  const saveImageOnComp = (
    createEl: any,
    canvas: HTMLCanvasElement,
    NameOfPaint: string
  ) => {
    createEl.href = canvas.toDataURL();
    createEl.download = NameOfPaint;
    createEl.click();
    createEl.remove();
  };

  return {
    saveImageOnComp,
  };
};
