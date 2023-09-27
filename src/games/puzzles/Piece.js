import { useState } from 'react'
import styles from '../../styles/puzzles.module.css'

const Piece = ({
        thekey,
        swap,
        revertSwap,
        bgImage,
        imageCoordY,
        imageCoordX,
        pieceCoordY,
        pieceCoordX,
        isDragOver,
        setIsDragOver
    }) => {

    const initialClasses = [styles.piece, styles[bgImage]]
    let draggableClasses = initialClasses
    let receiverClasses = [styles.receiver]

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

    const dragLeave = (ev) => {
        if (isDragOver) {
            revertSwap()
        }

    }

    const dragOver = (ev) => {
        ev.preventDefault()
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

    const drop = (ev) => {
        setIsDragOver(pieceCoordY, pieceCoordX, false)
    }

    const coords = [pieceCoordY, pieceCoordX, imageCoordY, imageCoordX]
        .map( coord => String(coord) )
        .join('-')

    return (
        <div
            onDrop={drop}
            onDragOver={dragOver}
            className={receiverClasses.join(' ')}
        >
            <div
                style={pieceStyles}
                className={draggableClasses.join(' ')}
                draggable="true"
                onDragStart={dragStarts}
                onDragLeave={dragLeave}
                data-coords={coords}
            >
                <div class={styles.screen}></div>
            </div>
        </div>
    )

}

export default Piece
