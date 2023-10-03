import { useState } from 'react'
import Piece from './Piece.js'
import styles from '../../styles/puzzles.module.css'

const width = 8
const height = 6

const Game = ({ puzzles }) => {

    const [ grid, setGrid ] = useState(getInitialGrid())
    const [ gridCount, setGridCount] = useState(0)
    const [ selectedPuzzle, setSelectedPuzzle ] = useState(puzzles[3])
    const [ currentSwap, setCurrentSwap ] = useState(null)

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

    const getGridWithSwap = (currentGrid, target, origin) => {
        return currentGrid.map( (row, rowIndex) => {
            return row.map( (piece, pieceIndex) => {
                if (rowIndex === target.pieceCoordY && pieceIndex === target.pieceCoordX) {
                    return {
                        ...piece,
                        imageCoordY : origin.imageCoordY,
                        imageCoordX : origin.imageCoordX,
                        isDragOver  : true,
                    }
                }
                if (rowIndex === origin.pieceCoordY && pieceIndex === origin.pieceCoordX) {
                    return {
                        ...piece,
                        imageCoordY : target.imageCoordY,
                        imageCoordX : target.imageCoordX,
                    }
                }
                return { ...piece }
            })
        })
    }

    const getGridWithRevertedSwap = (currentGrid, target, origin) => {
        return currentGrid.map( (row, rowIndex) => {
            return row.map( (piece, pieceIndex) => {
                if (rowIndex === target.pieceCoordY && pieceIndex === target.pieceCoordX) {
                    return {
                        ...piece,
                        imageCoordY : target.imageCoordY,
                        imageCoordX : target.imageCoordX,
                        isDragOver  : false,
                    }
                }
                if (rowIndex === origin.pieceCoordY && pieceIndex === origin.pieceCoordX) {
                    return {
                        ...piece,
                        imageCoordY : origin.imageCoordY,
                        imageCoordX : origin.imageCoordX,
                    }
                }
                return { ...piece }
            })
        })
    }

    const bgImage = selectedPuzzle.name

    const swap = (target, origin) => {
        let newGrid = grid
        if (currentSwap !== null) {
            newGrid = getGridWithRevertedSwap(grid, currentSwap.target, currentSwap.origin)
        }
        setGrid(getGridWithSwap(newGrid, target, origin))
        setGridCount(gridCount+1)
        setCurrentSwap({ target, origin })
    }

    const revertSwap = () => {
        if (currentSwap !== null) {
            setGrid(getGridWithRevertedSwap(grid, currentSwap.target, currentSwap.origin))
            setGridCount(gridCount+1)
            setCurrentSwap(null)
        }
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
                thekey={key}
                bgImage={bgImage}
                imageCoordY={piece.imageCoordY}
                imageCoordX={piece.imageCoordX}
                pieceCoordY={piece.pieceCoordY}
                pieceCoordX={piece.pieceCoordX}
                isDragOver={piece.isDragOver}
                setIsDragOver={setIsDragOver}
                setCurrentSwap={setCurrentSwap}
            />
        })
        const rowKey = String(rowIndex) + String(gridCount)
        return (
            <div key={rowKey} className={styles.row}>
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
