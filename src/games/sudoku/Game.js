// rename:
//          Square -> Cell,
//          Area -> Region
//          Stick, Band
import styles from '../../styles/sudoku.module.css'
import { useState } from 'react'
import Square from './Square.js'

const animationDuration = 500

function Game() {

    const coordinates = Array.from( { length: 9 }, (_,i) => i ).map( rowIndex => {
        let squares = Array.from( { length: 9 }, (_,i) => i).map( colIndex => {
            return [rowIndex, colIndex]
        })
        return squares
    })

    let [ matrix, setMatrix ] = useState(coordinates.map( (row, rowIndex) => {
        return row.map( (_, colIndex) => {
            return {
                areaY       : Math.ceil((rowIndex+1) / 3),
                areaX       : Math.ceil((colIndex+1) / 3),
                rowIndex    : rowIndex,
                colIndex    : colIndex,
                value       : '',
                highlighted : false,
                remainingPerRow     : [1,2,3,4,5,6,7,8,9],
                remainingPerCol     : [1,2,3,4,5,6,7,8,9],
                remainingPerArea    : [1,2,3,4,5,6,7,8,9],
            }
        })
    }))

    function updateValue(rowIndex, colIndex, keyCode, focusTarget) {
        let value = null
        let square = matrix[rowIndex][colIndex]

        if ([8,46,48,68].includes(keyCode)) {
            value = ""
        }

        if (keyCode > 48 && keyCode < 58) {
            value = keyCode - 48
            const existsInRow    = numberExistsInRow(rowIndex, value, colIndex)
            const existsInColumn = numberExistsInColumn(colIndex, value, rowIndex)
            const existsInArea   = numberExistsInArea(square.areaY, square.areaX, value, rowIndex, colIndex)
            if (existsInRow || existsInColumn || existsInArea) {
                return
            }
        }

        if (value === null) {
            return
        }

        focusTarget.blur()

        let tempMatrix = matrix
        if (Number.isInteger(square.value) && value === "") {
            tempMatrix = alterRowRemainings(matrix, rowIndex, square.value, true)
            tempMatrix = alterColRemainings(tempMatrix, colIndex, square.value, true)
        }
        else if (Number.isInteger(value) && square.value === "") {
            tempMatrix = alterRowRemainings(matrix, rowIndex, value, false)
            tempMatrix = alterColRemainings(tempMatrix, colIndex, value, false)
        }

        setProperty(tempMatrix, rowIndex, colIndex, 'value', value)
    }

    function numberExistsInRow(rowIndex, number, originalColIndex) {
        let colIndex = matrix[rowIndex].findIndex( square => square.value === number)
        setProperty(matrix, rowIndex, colIndex, 'highlighted', true)
        if (colIndex !== originalColIndex) {
            setTimeout( () => { setProperty(matrix, rowIndex, colIndex, 'highlighted', false) }, animationDuration)
        }

        return colIndex !== -1
    }

    function numberExistsInColumn(colIndex, number, originalRowIndex) {
        let rowIndex = matrix.reduce( (acc,row) => {
            acc.push(row[colIndex])
            return acc
        }, []).findIndex( square => square.value === number)
        setProperty(matrix, rowIndex, colIndex, 'highlighted', true)
        if (rowIndex !== originalRowIndex) {
            setTimeout( () => { setProperty(matrix, rowIndex, colIndex, 'highlighted', false) }, animationDuration)
        }

        return rowIndex !== -1
    }

    function numberExistsInArea(areaY, areaX, number, originalRowIndex, originalColIndex) {
        let square = matrix.filter( (row, currentRowIndex) => {
            let currentAreaY = Math.ceil((currentRowIndex+1) / 3)
            return currentAreaY === areaY
        }).reduce( (acc, row) => {
            return acc.concat(row.filter ( (square) => {
                return square.areaX === areaX
            }))
        }, []).find( square => square.value === number )

        if (!square){
            return false
        }

        let { rowIndex, colIndex } = square

        setProperty(matrix, rowIndex, colIndex, 'highlighted', true)
        if (rowIndex !== originalRowIndex) {
            setTimeout( () => { setProperty(matrix, rowIndex, colIndex, 'highlighted', false) }, animationDuration)
        }
        return true
    }

    function alterRowRemainings(tempMatrix, rowIndex,  number, add = false) {
        return tempMatrix.map( (row, currentRowIndex) => {
            if (rowIndex === currentRowIndex){
                return row.map( square => {
                    const elementIndex = square.remainingPerRow.indexOf(number)
                    if (elementIndex > -1){
                        if (!add) {
                            square.remainingPerRow.splice(elementIndex, 1)
                        }
                    }
                    else {
                        if (add) {
                            square.remainingPerRow.push(number)
                        }
                    }
                    return square
                })
            }
            return row
        })
    }

    function alterColRemainings(tempMatrix, colIndex,  number, add = false) {
        return tempMatrix.map( (row) => {
            return row.map( (square, currentColIndex) => {
                if (colIndex === currentColIndex){
                    const elementIndex = square.remainingPerCol.indexOf(number)
                    if (elementIndex > -1){
                        if (!add) {
                            square.remainingPerCol.splice(elementIndex, 1)
                        }
                    }
                    else {
                        if (add) {
                            square.remainingPerCol.push(number)
                        }
                    }
                }
                return square
            })
        })
    }

    function setProperty(tempMatrix, rowIndex, colIndex, property, value) {
        setMatrix( tempMatrix.map( (row, currentRowIndex) => {
            if ( rowIndex === currentRowIndex) {
                return row.map( (square, currentColIndex) => {
                    if (colIndex === currentColIndex) {
                        square[property] = value
                    }
                    return square
                })
            }
            return row
        }))
    }

    let board = matrix.map( (row, rowIndex) => {
        let displayRow = row.map( (square, colIndex) => {
            return <Square
                colIndex={colIndex}
                rowIndex={rowIndex}
                value={square.value}
                highlighted={square.highlighted}
                updateValue={updateValue}
                remainingPerRow={square.remainingPerRow}
                remainingPerCol={square.remainingPerCol}
                remainingPerArea={square.remainingPerArea}
            />
        })
        let classes = [styles.row]
        if ((rowIndex + 1) % 3 === 0) {
            classes.push(styles['border-bottom'])
        }
        return <div className={classes.join(' ')}>{displayRow}</div>
    })

    return (
        <div className={styles.sudoku}>
            <div className={styles.board}>
                <div className={styles.line}>
                    {board}         
                </div>
            </div>
        </div>
    )
}

export default Game
