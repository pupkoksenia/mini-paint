import { Ref } from 'vue'
export const drawCircle = (
    canvas: Ref<HTMLCanvasElement>,
    x: Ref<number>,
    y: Ref<number>,
    x2: Ref<number>,
    y2: Ref<number>,
    context: Ref<any>,
    imgData: Ref<any>,
    toGetImageData: () => any,
    toHistoryPush: () => void,
    strokeStyleValue: Ref<string>,
    stateOfFigure: Ref<string>
) => {
    canvas.value.onmousedown = function (e: MouseEvent) {
        x.value = e.offsetX
        y.value = e.offsetY
        canvas.value.onmousemove = function (e: MouseEvent) {
            x2.value = e.offsetX
            y2.value = e.offsetY
            const makeCircle = () => {
                const a = x.value - x2.value
                const b = y.value - y2.value
                const radius = Math.sqrt(a * a + b * b)
                context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
                context.value.beginPath()
                context.value.putImageData(imgData.value, 0, 0)
                context.value.moveTo(x.value, y.value)
                context.value.arc(x.value, y.value, radius, 0, Math.PI * 2, false)
                context.value.fillStyle = strokeStyleValue.value
                stateOfFigure.value === 'stroke' ? context.value.stroke() : context.value.fill()
            }
            context.value.closePath()
            if (e.buttons > 0) {
                makeCircle()
            } else {
                imgData.value = toGetImageData()
            }
        }
        toHistoryPush()
    }
}
