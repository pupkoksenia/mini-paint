import { reactive } from "vue";

export interface History {
  redoList: Array<string>;
  undoList: Array<string>;
}

const history = reactive<History>({
  redoList: [],
  undoList: [],
});

export interface HistoryPaint {
    saveState: (canvas: HTMLCanvasElement, list: Array<string>, keepReDo: boolean) => void
    undo: (canvas: HTMLCanvasElement, contex: any) => void
    redo: (canvas: HTMLCanvasElement, contex: any) => void
    restoreState: (canvas: HTMLCanvasElement, contex: any, pop: Array<string>, push: Array<string>) => void,
    history: History
}

export const useHistoryPaint: () => HistoryPaint = () => {
    const saveState = (canvas: HTMLCanvasElement, list: Array<string>, keepReDo:boolean)=>{
        keepReDo = keepReDo || false;
   
        if(!keepReDo) {
            history.redoList= [];
        }
        
        (list ||  history.undoList).push(canvas.toDataURL());  
        console.log( list || history.undoList) 
      }

      const undo = (canvas:  HTMLCanvasElement, contex: any) => {
        restoreState(canvas, contex, history.undoList, history.redoList);
      }
      const redo = (canvas:  HTMLCanvasElement, contex: any) => {
        restoreState(canvas, contex,history.redoList, history.undoList);
      }

      const restoreState = (canvas:  HTMLCanvasElement, contex: any,  pop: Array<string>, push: Array<string>)=> {
        if(pop.length) {
          saveState(canvas, push, true);
          const restoreState = pop.pop();
          const img = new Image
          img.src=restoreState || ""
          img.onload = function() {
            contex.clearRect(0, 0, 600, 400);
            contex.drawImage(img, 0, 0, 600, 400, 0, 0, 600, 400);  
          }
        }
      }

  return {
    saveState,
    undo,
    redo,
    restoreState,
    history
  };
};
