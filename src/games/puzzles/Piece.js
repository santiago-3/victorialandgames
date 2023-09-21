import { useState } from 'react'
import styles from '../../styles/puzzles.module.css'

const Piece = ({thekey, bgImage, imageCoordY, imageCoordX, pieceCoordY, pieceCoordX}) => {

    const initialClasses = [styles.piece, styles[bgImage]]
    let draggableClasses = initialClasses
    let receiverClasses = [styles.receiver]

    const width = 120
    const height = 90

    const [isDragOver, setIsDragOver] = useState(false)
    const [offsetX, setOffsetX] = useState(width  * imageCoordX)
    const [offsetY, setOffsetY] = useState(height * imageCoordY)

    const pieceStyles = {
        backgroundPosition: `-${offsetX}px -${offsetY}px`
    }

    const dragStarts = (ev) => {
        ev.dataTransfer.dropEffect = 'move'
        ev.dataTransfer.setData('text/plain', ev.target.dataset.coords)
    }

    const dragLeave = (ev) => {
        setIsDragOver(false)
        setOffsetX(width * imageCoordX)
        setOffsetY(height * imageCoordY)
    }

    const dragOver = (ev) => {
        ev.preventDefault()
        setIsDragOver(true)
        let [pcy, pcx, icy, icx] = ev.dataTransfer.getData('text/plain').split('-')

        setOffsetX(width * icx)
        setOffsetY(height * icy)
    }

    const drop = (ev) => {
        setIsDragOver(false)
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
