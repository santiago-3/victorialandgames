import styles from '../../styles/sudoku.module.css'
import { useState } from 'react'
import Cell from './Cell.js'

const animationDuration = 500

function Game() {

    const coordinates = Array.from( { length: 9 }, (_,i) => i ).map( rowIndex => {
        let cells = Array.from( { length: 9 }, (_,i) => i).map( colIndex => {
            return [rowIndex, colIndex]
        })
        return cells
    })

    const getRegionIndex = index => Math.ceil((index+1) / 3)

    let [ possibilities, setPossibilities ] = useState([])
    let [ selectedCellRemainings, setSelectedCellRemainings ] = useState([])
    let [ matrix, setMatrix ] = useState(coordinates.map( (row, rowIndex) => {
        return row.map( (_, colIndex) => {
            return {
                regionY       : getRegionIndex(rowIndex),
                regionX       : getRegionIndex(colIndex),
                rowIndex    : rowIndex,
                colIndex    : colIndex,
                value       : '',
                highlighted : false,
                remainingPerRow     : [1,2,3,4,5,6,7,8,9],
                remainingPerCol     : [1,2,3,4,5,6,7,8,9],
                remainingPerRegion    : [1,2,3,4,5,6,7,8,9],
            }
        })
    }))

    function updateValue(rowIndex, colIndex, keyCode, focusTarget) {
        let value = null
        let cell = matrix[rowIndex][colIndex]

        if ([8,46,48,68].includes(keyCode)) {
            value = ""
        }

        if (keyCode > 48 && keyCode < 58) {
            value = keyCode - 48
            const existsInRow    = numberExistsInRow(rowIndex, value, colIndex)
            const existsInColumn = numberExistsInColumn(colIndex, value, rowIndex)
            const existsInRegion = numberExistsInRegion(cell.regionY, cell.regionX, value, rowIndex, colIndex)
            if (existsInRow || existsInColumn || existsInRegion) {
                return
            }
        }

        if (value === null) {
            return
        }

        focusTarget.blur()

        let tempMatrix = matrix
        if (Number.isInteger(cell.value) && value === "") {
            tempMatrix = alterRowRemainings(tempMatrix, rowIndex, cell.value, true)
            tempMatrix = alterColRemainings(tempMatrix, colIndex, cell.value, true)
            tempMatrix = alterRegionRemainings(tempMatrix, cell.regionY, cell.regionX, cell.value, true)
        }
        else if (Number.isInteger(value) && cell.value === "") {
            tempMatrix = alterRowRemainings(tempMatrix, rowIndex, value, false)
            tempMatrix = alterColRemainings(tempMatrix, colIndex, value, false)
            tempMatrix = alterRegionRemainings(tempMatrix, cell.regionY, cell.regionX, value, false)
        }
        else if (Number.isInteger(value) && Number.isInteger(cell.value)) {
            // number to remove, add to remainings
            tempMatrix = alterRowRemainings(tempMatrix, rowIndex, cell.value, true)
            tempMatrix = alterColRemainings(tempMatrix, colIndex, cell.value, true)
            tempMatrix = alterRegionRemainings(tempMatrix, cell.regionY, cell.regionX, cell.value, true)
            // number to add, remove from remainings
            tempMatrix = alterRowRemainings(tempMatrix, rowIndex, value, false)
            tempMatrix = alterColRemainings(tempMatrix, colIndex, value, false)
            tempMatrix = alterRegionRemainings(tempMatrix, cell.regionY, cell.regionX, value, false)
        }

        setProperty(tempMatrix, rowIndex, colIndex, 'value', value)
        setSelectedCellRemainings(getRemainings(matrix[rowIndex][colIndex]))
    }

    function cellSelected(rowIndex, colIndex) {
        let remainings = getRemainings(matrix[rowIndex][colIndex])
        setSelectedCellRemainings(remainings)
        setPossibilities(getPossibilitiesForSelected(remainings, matrix[rowIndex][colIndex]))
    }

    function numberExistsInRow(rowIndex, number, originalColIndex) {
        let colIndex = matrix[rowIndex].findIndex( cell => cell.value === number)
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
        }, []).findIndex( cell => cell.value === number)
        setProperty(matrix, rowIndex, colIndex, 'highlighted', true)
        if (rowIndex !== originalRowIndex) {
            setTimeout( () => { setProperty(matrix, rowIndex, colIndex, 'highlighted', false) }, animationDuration)
        }

        return rowIndex !== -1
    }

    function numberExistsInRegion(regionY, regionX, number, originalRowIndex, originalColIndex) {
        let cell = matrix.filter( (row, currentRowIndex) => {
            let currentRegionY = getRegionIndex(currentRowIndex)
            return currentRegionY === regionY
        }).reduce( (acc, row) => {
            return acc.concat(row.filter ( cell => {
                return cell.regionX === regionX
            }))
        }, []).find( cell => cell.value === number )

        if (!cell){
            return false
        }

        let { rowIndex, colIndex } = cell

        setProperty(matrix, rowIndex, colIndex, 'highlighted', true)
        if (rowIndex !== originalRowIndex) {
            setTimeout( () => { setProperty(matrix, rowIndex, colIndex, 'highlighted', false) }, animationDuration)
        }
        return true
    }

    function alterRowRemainings(tempMatrix, rowIndex,  number, add = false) {
        return tempMatrix.map( (row, currentRowIndex) => {
            if (rowIndex === currentRowIndex){
                return row.map( cell => {
                    const elementIndex = cell.remainingPerRow.indexOf(number)
                    if (elementIndex > -1){
                        if (!add) {
                            cell.remainingPerRow.splice(elementIndex, 1)
                        }
                    }
                    else {
                        if (add) {
                            cell.remainingPerRow.push(number)
                        }
                    }
                    return cell
                })
            }
            return row
        })
    }

    function alterColRemainings(tempMatrix, colIndex,  number, add = false) {
        return tempMatrix.map( (row) => {
            return row.map( (cell, currentColIndex) => {
                if (colIndex === currentColIndex){
                    const elementIndex = cell.remainingPerCol.indexOf(number)
                    if (elementIndex > -1){
                        if (!add) {
                            cell.remainingPerCol.splice(elementIndex, 1)
                        }
                    }
                    else {
                        if (add) {
                            cell.remainingPerCol.push(number)
                        }
                    }
                }
                return cell
            })
        })
    }

    function alterRegionRemainings(tempMatrix, regionY, regionX,  number, add = false) {
        return tempMatrix.map( (row, currentRowIndex) => {
            if (regionY === getRegionIndex(currentRowIndex)) {
                return row.map( (cell, currentColIndex) => {
                    if (regionX === getRegionIndex(currentColIndex)){
                        const elementIndex = cell.remainingPerRegion.indexOf(number)
                        if (elementIndex > -1){
                            if (!add) {
                                cell.remainingPerRegion.splice(elementIndex, 1)
                            }
                        }
                        else {
                            if (add) {
                                cell.remainingPerRegion.push(number)
                            }
                        }
                    }
                    return cell
                })
            }
            return row
        })
    }

    function setProperty(tempMatrix, rowIndex, colIndex, property, value) {
        setMatrix( tempMatrix.map( (row, currentRowIndex) => {
            if ( rowIndex === currentRowIndex) {
                return row.map( (cell, currentColIndex) => {
                    if (colIndex === currentColIndex) {
                        cell[property] = value
                    }
                    return cell
                })
            }
            return row
        }))
    }

    function getRemainings(cell) {
        return [1,2,3,4,5,6,7,8,9].filter( number => {
            return cell.remainingPerRow.includes(number)
                && cell.remainingPerCol.includes(number)
                && cell.remainingPerRegion.includes(number)
        })
    }

    function getPossibilitiesForSelected(remainings, cell) {
        return remainings.map( number => {
            let row = JSON.parse(JSON.stringify(matrix[cell.rowIndex]))
            let col = JSON.parse(JSON.stringify(matrix.map( currentRow => {
                return currentRow[cell.colIndex]
            })))
            let region = JSON.parse(JSON.stringify(matrix.reduce( (acc, currentRow) => {
                return acc.concat(currentRow.filter( currentCell => {
                    return currentCell.rowIndex !== cell.rowIndex
                        && currentCell.colIndex !== cell.colIndex
                        && currentCell.regionY === cell.regionY
                        && currentCell.regionX === cell.regionX
                }))
            }), []))

            let alteredRow = row.filter( currentCell => {
                return currentCell.value === '' && (currentCell.rowIndex !== cell.rowIndex || currentCell.colIndex !== cell.colIndex)
            }).map( cell => {
                const elementIndex = cell.remainingPerRow.indexOf(number)
                if (elementIndex > -1){
                    cell.remainingPerRow.splice(elementIndex, 1)
                }
                else {
                    cell.remainingPerRow.push(number)
                }
                return cell
            })

            let alteredCol = col.filter( currentCell => {
                return currentCell.value === '' && (currentCell.rowIndex !== cell.rowIndex || currentCell.colIndex !== cell.colIndex)
            }).map( cell => {
                const elementIndex = cell.remainingPerRow.indexOf(number)
                if (elementIndex > -1){
                    cell.remainingPerRow.splice(elementIndex, 1)
                }
                else {
                    cell.remainingPerRow.push(number)
                }
                return cell
            })

            let alteredRegion = region.filter( currentCell => {
                return currentCell.value === ''
            }).map( cell => {
                const elementIndex = cell.remainingPerRow.indexOf(number)
                if (elementIndex > -1){
                    cell.remainingPerRow.splice(elementIndex, 1)
                }
                else {
                    cell.remainingPerRow.push(number)
                }
                return cell
            })

            let allRelatedCells = alteredRow.concat(alteredCol.concat(alteredRegion))

            let smaller = allRelatedCells.reduce ( (acc, currentCell) => {
                let remainingsLength = getRemainings(currentCell).length
                if (remainingsLength < acc) {
                    return remainingsLength
                }
                return acc
            }, 9)

            let sum = allRelatedCells.reduce ( (acc, currentCell) => {
                return acc + getRemainings(currentCell).length
            }, 0)

            return { number, smaller, sum }
        })
    }

    let board = matrix.map( (row, rowIndex) => {
        let displayRow = row.map( (cell, colIndex) => {
            return <Cell
                colIndex={colIndex}
                rowIndex={rowIndex}
                value={cell.value}
                highlighted={cell.highlighted}
                updateValue={updateValue}
                remainingPerRow={cell.remainingPerRow}
                remainingPerCol={cell.remainingPerCol}
                remainingPerRegion={cell.remainingPerRegion}
                cellSelected={cellSelected}
                possibilities={possibilities}
            />
        })
        let classes = [styles.row]
        if ((rowIndex + 1) % 3 === 0) {
            classes.push(styles['border-bottom'])
        }
        return <div className={classes.join(' ')}>{displayRow}</div>
    })

    let possibilitiesDisplay = possibilities.map( pos => {
        return <div>{`${pos.number}: Smaller: ${pos.smaller}, Sum: ${pos.sum}`}</div>
    })

    return (
        <div className={styles.sudoku}>
            <div className={styles.board}>
                {board}
            </div>
            <div className={styles.info} >{ possibilitiesDisplay }</div>
        </div>
    )
}

export default Game
