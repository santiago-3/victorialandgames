import '../../styles/minesweeper.css'
import Square from './Square.js'
import { useState, useEffect } from 'react'

const relativeSurroundingPositions = [
    [-1,-1],
    [-1,0],
    [-1,1],
    [0,-1],
    [0,1],
    [1,-1],
    [1,0],
    [1,1],
]

let height = 10
let width = 20
let totalMines = 32
let minePositions = []

const states = {
    RUNNING: 0,
    WON: 1,
    GAME_OVER: 2
}

const properties = {
    REVEALED: 'revealed',
    LOST: 'lost'
}

function Minesweeper() {

    let [ rows, setRows ] = useState( [] )
    let [ state, setState ] = useState(states.RUNNING)

    let coordinates = Array.from( { length: height }, (_,i) => i ).map( rowNum => {
        let squares = Array.from( { length: width }, (_,i) => i).map( squareNum => {
            return [rowNum, squareNum]
        })
        return squares
    })

    let flatCoordinates = flattenCoordinates(coordinates)

    useEffect( () => {
        init()
    }, [])

    useEffect( () => {
        if (rows.length > 0) {
            let someSquaresNotRevealed = rows.some(row => row.some( square => !square.revealed && !square.hasFlag ))
            if (! someSquaresNotRevealed) {
                setState(states.WON)
            }
        }
    }, [rows])

    let displayRows = rows.map( row => {
        let squares = row.map( (square) => {
            return <Square
                rowNum={square.rowNum}
                squareNum={square.squareNum}
                hasMine={square.hasMine}
                surroundingMines={square.surroundingMines}
                revealed={square.revealed}
                hasFlag={square.hasFlag}
                action={ () => { squareClicked(square.rowNum, square.squareNum) }}
                rightAction={ (e) => { 
                    e.preventDefault()
                    rightClicked(square.rowNum, square.squareNum)
                }}
                lost={square.lost}
                gameOver={state === states.GAME_OVER}
            />
        })
        return (
            <div class="row">
                { squares }
            </div>
        )
    })

    function squareClicked(rowNum, squareNum) {
        if (state == states.RUNNING) {
            let square = rows[rowNum][squareNum]
            if (square.hasFlag) {
                toggleFlag(rowNum, squareNum)
            }
            else {
                let queue = [[rowNum, squareNum]]
                let history = queue
                revealRecursiveSquares(queue, history, true)
            }
        }
    }

    function rightClicked(rowNum, squareNum) {
        let square = rows[rowNum][squareNum]
        if (state == states.RUNNING && !square.revealed) {
            toggleFlag(rowNum, squareNum)
        }
    }

    function toggleFlag(rowNum, squareNum) {
        setRows( rows.map( (row, rowIndex) => {
            if ( rowIndex === rowNum ) { 
                return row.map( (square, sqIndex) => {
                    if (squareNum === sqIndex) {
                        square.hasFlag = !square.hasFlag
                    }
                    return square
                })
            }
            return row
        }))
    }

    function setProperty(rowNum, squareNum, property, value) {
        setRows( rows.map( (row, rowIndex) => {
            if ( rowIndex === rowNum ) { 
                return row.map( (square, sqIndex) => {
                    if (squareNum === sqIndex) {
                        square[property] = value
                    }
                    return square
                })
            }
            return row
        }))
    }

    function getAbsoluteSurroundingPositions(rowNum, squareNum, mines) {
        return relativeSurroundingPositions.map( ([relRowNum, relSquareNum]) => {
            return [rowNum + relRowNum, squareNum + relSquareNum]
        }).filter( ([row, sq]) => row > -1 && row < height && sq > -1 && sq < width )
    }

    function countSourroundingMines(rowNum, squareNum, mines) {
        const absoluteSurroundingPositions = getAbsoluteSurroundingPositions(rowNum, squareNum, mines)

        return absoluteSurroundingPositions.filter( ([rowNum, squareNum]) => {
            return hasMine(rowNum, squareNum, mines)
        }).length
    }

    function revealRecursiveSquares(queue, history, isClick = false) {
        let [sRowNum, sSquareNum] = queue.shift()
        let square = rows[sRowNum][sSquareNum]

        if (square.hasMine) {
            if (isClick) {
                gameOver(sRowNum, sSquareNum)
            }
        }
        else {
            setProperty(square.rowNum, square.squareNum, properties.REVEALED, true)
        }

        if (!square.hasMine && square.surroundingMines === 0){
            let surroundingPositions = getAbsoluteSurroundingPositions(sRowNum,sSquareNum)

            surroundingPositions.forEach( ([rowNum, squareNum]) => {
                let adjSquare = rows[rowNum][squareNum]

                let revealed = adjSquare.revealed
                revealed |= history.some( ([hRowNum, hSquareNum]) => hRowNum === rowNum && hSquareNum === squareNum )

                if (! revealed) {

                    // check for corner case
                    if (square.rowNum === rowNum || square.squareNum === squareNum) {
                        queue.push([rowNum, squareNum])
                        history.push([rowNum, squareNum])
                    }
                    else if (!adjSquare.hasMine && adjSquare.surroundingMines > 0) {
                        setProperty(rowNum, squareNum, properties.REVEALED, true)
                    }
                }
            })
        }

        if (queue.length > 0) {
            revealRecursiveSquares(queue, history, false)
        }
        return

    }


    function gameOver(sRowNum, sSquareNum) {
        setProperty(sRowNum, sSquareNum, properties.LOST, true)
        minePositions.forEach( ([rowNum, squareNum]) => {
            setProperty(rowNum, squareNum, properties.REVEALED, true)
        })
        setState(states.GAME_OVER)
    }

    function init() {

        minePositions = selectMinePositions(totalMines, flatCoordinates)

        setRows(coordinates.map( row => {
            let squares = row.map( ([rowNum, squareNum]) => {
                return {
                    rowNum,
                    squareNum,
                    hasMine:hasMine(rowNum, squareNum, minePositions),
                    surroundingMines:countSourroundingMines(rowNum, squareNum, minePositions),
                    revealed: false,
                    hasFlag: false,
                    lost: false
                }
            })
            return squares
        }))
    }

    return (
        <div class="minesweeper">
            <div class="title-bar">
                Mine sweeper
            </div>
            <div class="status-bar">
            </div>
            <div class="game">
                { displayRows }
            </div>
        </div>
    )
}

function hasMine(rowNum, squareNum, mines) {
    return mines.some( ([mineRowNum, mineSquareNum]) => rowNum === mineRowNum && squareNum === mineSquareNum )
}

function flattenCoordinates(coordinates) {
    return coordinates.reduce( (acc, current) => {
        return acc.concat(current)
    }, [] )
}

function selectMinePositions(totalMines, coordinates) {
    let mines = []
    for (let i=0; i<totalMines; i++) {
        let position = Math.floor(Math.random() * coordinates.length)
        mines.push(coordinates[position])
        coordinates.splice(position, 1)
    }
    return mines
}

export default Minesweeper
