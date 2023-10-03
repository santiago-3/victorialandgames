import { useState } from 'react'
import styles from '../../styles/puzzles.module.css'

const dragIntensityNeeded = 15

const Piece = ({
        thekey,
        swap,
        bgImage,
        imageCoordY,
        imageCoordX,
        pieceCoordY,
        pieceCoordX,
        isDragOver,
        setIsDragOver,
        setCurrentSwap,
    }) => {

    const initialClasses = [styles.piece, styles[bgImage]]
    let draggableClasses = initialClasses
    let receiverClasses = [styles.receiver]
    const [dragOverCount, setDragOverCount] = useState(0)


    const width = 120
    const height = 90

    const offsetX = width  * imageCoordX
    const offsetY = height * imageCoordY

    const pieceStyles = {
        backgroundPosition: `-${offsetX}px -${offsetY}px`
    }

    const dragStarts = (ev) => {
        ev.dataTransfer.dropEffect = 'move'
        ev.dataTransfer.setData('text/plain', ev.target.dataset.coords)
    }

    const dragLeaveOrEnd = (ev) => {
        setDragOverCount(0)
    }

    const dragOver = (ev) => {
        ev.preventDefault()
        if (dragOverCount === dragIntensityNeeded)  {
            let [pcy, pcx, icy, icx] = ev.dataTransfer.getData('text/plain').split('-').map( n => Number(n) )

            if (! isDragOver) {
                const target = {
                    pieceCoordY,
                    pieceCoordX,
                    imageCoordY,
                    imageCoordX,
                }
                const origin = {
                    pieceCoordY : pcy,
                    pieceCoordX : pcx,
                    imageCoordY : icy,
                    imageCoordX : icx,
                }
                swap (target, origin)
            }
        }
        else {
            setDragOverCount( dragOverCount+1 )
        }
    }

    const drop = (ev) => {
        setDragOverCount(0)
        setIsDragOver(pieceCoordY, pieceCoordX, false)
        setCurrentSwap(null)
    }

    const coords = [pieceCoordY, pieceCoordX, imageCoordY, imageCoordX]
        .map( coord => String(coord) )
        .join('-')

    return (
        <div
            onDrop={drop}
            onDragOver={dragOver}
            style={pieceStyles}
            className={draggableClasses.join(' ')}
            draggable="true"
            onDragStart={dragStarts}
            onDragLeave={dragLeaveOrEnd}
            onDragEnd={dragLeaveOrEnd}
            data-coords={coords}
        >
            <div class={styles.screen}>
                {dragOverCount}
            </div>
        </div>
    )

}

export default Piece
