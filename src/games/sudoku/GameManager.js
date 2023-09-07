import Game from './Game.js'
import { useState } from 'react'
import styles from '../../styles/sudoku.module.css'

function GameManager({items, selected, setSelected}) {

    if (selected !== items.SUDOKU) {
        setSelected(items.SUDOKU)
    }

    const coordinates = Array.from( { length: 9 }, (_,i) => i ).map( rowIndex => {
        let cells = Array.from( { length: 9 }, (_,i) => i).map( colIndex => {
            return [rowIndex, colIndex]
        })
        return cells
    })

    const getRegionIndex = index => Math.ceil((index+1) / 3)

    let [ matrix, setMatrix ] = useState(getCleanMatrix())
    let [ completeMatrix, setCompleteMatrix ] = useState({})
    let [ cleanMatrix, setCleanMatrix ] = useState({})
    let [ gameKey, setGameKey ] = useState(0)
    let [ showingSolution, setShowingSolution ] = useState(false)

    function newGame() {
        setGameKey(gameKey+1)
    }

    function restart() {
        setMatrix(JSON.parse(cleanMatrix))
        setShowingSolution(false)
    }

    function showSolution() {
        const clean = JSON.parse(cleanMatrix)
        const complete = JSON.parse(completeMatrix)
        setMatrix(complete.map( (row, rowIndex) => {
            return row.map( (cell, colIndex) => {
                cell.locked = clean[rowIndex][colIndex].locked
                return cell
            })
        }))
        setShowingSolution(true)
    }

    function getCleanMatrix() {
        return coordinates.map( (row, rowIndex) => {
            return row.map( (_, colIndex) => {
                return {
                    regionY     : getRegionIndex(rowIndex),
                    regionX     : getRegionIndex(colIndex),
                    rowIndex    : rowIndex,
                    colIndex    : colIndex,
                    value       : '',
                    highlighted : false,
                    locked      : true,
                    remainingPerRow     : [1,2,3,4,5,6,7,8,9],
                    remainingPerCol     : [1,2,3,4,5,6,7,8,9],
                    remainingPerRegion  : [1,2,3,4,5,6,7,8,9],
                }
            })
        })
    }

    return (
        <div className={styles.sudoku}>
            <div className='title-bar'>
                Sudoku
            </div>
            <div className={styles['status-bar']}>
                <button onClick={newGame}>
                    new
                </button>
                <button onClick={restart}>
                    restart
                </button>
            </div>
            <Game
                key={gameKey}
                matrix={matrix}
                setMatrix={setMatrix}
                getCleanMatrix={getCleanMatrix}
                getRegionIndex={getRegionIndex}
                setCompleteMatrix={setCompleteMatrix}
                setCleanMatrix={setCleanMatrix}
            />
            <div>
                {
                    ! showingSolution &&
                        <button onClick={showSolution} className={styles['solution-button']}>
                            display solution
                        </button>
                }
                {
                    showingSolution &&
                    <button onClick={restart} className={styles['solution-button']}>
                        hide solution
                    </button>
                }
            </div>
        </div>
    )
}

export default GameManager
