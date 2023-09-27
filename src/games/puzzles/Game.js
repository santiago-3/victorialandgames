import { useState } from 'react'
import Piece from './Piece.js'
import styles from '../../styles/puzzles.module.css'

const width = 3
const height = 3

const Game = ({ puzzles }) => {

    const [ grid, setGrid ] = useState(getInitialGrid())
    const [ selectedPuzzle, setSelectedPuzzle ] = useState(puzzles[3])
    const [ lastSwap, setLastSwap ] = useState({})

    console.log(JSON.stringify(grid))

    function getInitialGrid() {


        const positions = new Set(Array.from( { length: width * height }, (_,i) => i ))

        return Array.from( { length: height }, (_,i) => i ).map( pieceCoordY => {
            let pieces = Array.from( { length: width }, (_,i) => i).map( pieceCoordX => {

                const positionsLeftSize = positions.size-1
                const randomPositionIndex = Math.floor(Math.random() * positionsLeftSize)
                const positionsLeft = Array.from(positions.values())
                const randomPos = positionsLeft[randomPositionIndex]
                positions.delete(randomPos)

                const imageCoordY = Math.floor(randomPos / width)
                const imageCoordX = randomPos % width

                return {
                    pieceCoordY,
                    pieceCoordX,
                    imageCoordY,
                    imageCoordX,
                    isDragOver: false
                }
            })
            return pieces
        })
    }

    const bgImage = selectedPuzzle.name

    const swap = (target, origin) => {
        setLastSwap({ target, origin })
        setGrid( grid.map( (row, rowIndex) => {
            return row.map( (piece, pieceIndex) => {
                if (rowIndex === target.pieceCoordY && pieceIndex === target.pieceCoordX) {
                    piece.imageCoordY = origin.imageCoordY
                    piece.imageCoordX = origin.imageCoordX
                    piece.isDragOver  = true
                }
                if (rowIndex === origin.pieceCoordY && pieceIndex === origin.pieceCoordX) {
                    piece.imageCoordY = target.imageCoordY
                    piece.imageCoordX = target.imageCoordX
                }
                return piece
            })
        }))
    }

    // if you think swap and revert swap are the same take a more careful look
    const revertSwap = () => {
        const { target, origin } = lastSwap
        setGrid( grid.map( (row, rowIndex) => {
            return row.map( (piece, pieceIndex) => {
                if (rowIndex === target.pieceCoordY && pieceIndex === target.pieceCoordX) {
                    piece.imageCoordY = target.imageCoordY
                    piece.imageCoordX = target.imageCoordX
                    piece.isDragOver  = false
                }
                if (rowIndex === origin.pieceCoordY && pieceIndex === origin.pieceCoordX) {
                    piece.imageCoordY = origin.imageCoordY
                    piece.imageCoordX = origin.imageCoordX
                }
                return piece
            })
        }))
    }

    const setIsDragOver = (pieceCoordY, pieceCoordX, value) => {
        setGrid( grid.map( (row, rowIndex) => {
            return row.map( (piece, pieceIndex) => {
                if (rowIndex === pieceCoordY && pieceIndex === pieceCoordX) {
                    piece.isDragOver = value
                }
                return piece
            })
        }))
    }

    const puzzle = grid.map( (row, rowIndex) => {
        const rowPieces = row.map( piece => {
            const key = bgImage + String(piece.imageCoordY*width + piece.imageCoordX)
            return <Piece 
                key={key}
                swap={swap}
                revertSwap={revertSwap}
                thekey={key}
                bgImage={bgImage}
                imageCoordY={piece.imageCoordY}
                imageCoordX={piece.imageCoordX}
                pieceCoordY={piece.pieceCoordY}
                pieceCoordX={piece.pieceCoordX}
                isDragOver={piece.isDragOver}
                setIsDragOver={setIsDragOver}
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
            { /*
            <button onClick={change}>Change!</button>
            <button onClick={revertSwap}>Revert!</button>
            */ }
        </>
    )
}

export default Game
