import { useState } from 'react'
import Piece from './Piece.js'
import styles from '../../styles/puzzles.module.css'

const Game = ({puzzles}) => {

    const width = 8
    const height = 6

    const [ selectedPuzzle, setSelectedPuzzle ] = useState(puzzles[0])

    const bgImage = selectedPuzzle.name

    const positions = new Set(Array.from( { length: width * height }, (_,i) => i ))

    const grid = Array.from( { length: height }, (_,i) => i ).map( pieceCoordY => {
        let pieces = Array.from( { length: width }, (_,i) => i).map( pieceCoordX => {

            const positionsLeftSize = positions.size-1
            const randomPositionIndex = Math.floor(Math.random() * positionsLeftSize)
            const positionsLeft = Array.from(positions.values())
            const randomPos = positionsLeft[randomPositionIndex]
            positions.delete(randomPos)

            const imageCoordY = Math.floor(randomPos / width)
            const imageCoordX = randomPos % width

            return {pieceCoordX, pieceCoordY, imageCoordX, imageCoordY}
        })
        return pieces
    })

    const puzzle = grid.map( (row, rowIndex) => {
        const rowPieces = row.map( piece => {
            const key = bgImage + String(piece.pieceCoordY*width + piece.pieceCoordX)
            return <Piece 
                key={key}
                thekey={key}
                bgImage={bgImage}
                imageCoordY={piece.imageCoordY}
                imageCoordX={piece.imageCoordX}
                pieceCoordY={piece.pieceCoordY}
                pieceCoordX={piece.pieceCoordX}
            />
        })
        return (
            <div key={rowIndex} className={styles.row}>
                {rowPieces}
            </div>
        )
    })

    const images = puzzles.map( puzzle => {
        return (
            <div 
                onClick={ () => setSelectedPuzzle(puzzle) }
                className={styles.puzzleImage} >
                <img src={`images/puzzles/${puzzle.fileName}`} />
            </div>
        )
    })

    const puzzleClasses = [styles.puzzle, styles[bgImage]]

    return (
        <>
            <div className={styles.puzzlesList}>
                {images}
            </div>
            <div className={puzzleClasses.join(' ')}>{puzzle}</div>
        </>
    )

}

export default Game
