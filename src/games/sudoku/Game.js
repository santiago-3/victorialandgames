import styles from '../../styles/sudoku.module.css'
import { useState } from 'react'
import Cell from './Cell.js'
import GameGenerator from './GameGenerator.js'

const animationDuration = 500

function Game({matrix,
    setMatrix,
    getCleanMatrix,
    getRegionIndex,
    setCompleteMatrix,
    setCleanMatrix,
}) {

    let [ possibilities, setPossibilities ] = useState([])
    let [ selectedCellRemainings, setSelectedCellRemainings ] = useState([])

    function updateValue(rowIndex, colIndex, keyCode, focusTarget) {
        let value = null

        if ([8,46,48,68].includes(keyCode)) {
            value = ""
        }

        if (keyCode > 48 && keyCode < 58) {
            value = keyCode - 48
        }

        if (value === null) {
            return
        }

        let tempMatrix = getUpdatedMatrix(matrix, rowIndex, colIndex, value, focusTarget)

        setMatrix(tempMatrix)
        setSelectedCellRemainings(getRemainings(matrix[rowIndex][colIndex]))
    }

    function getUpdatedMatrix(tempMatrix, rowIndex, colIndex, value, focusTarget) {

        let cell = tempMatrix[rowIndex][colIndex]

        const existsInRow    = numberExistsInRow(tempMatrix, rowIndex, value, colIndex)
        const existsInColumn = numberExistsInColumn(tempMatrix, colIndex, value, rowIndex)
        const existsInRegion = numberExistsInRegion(tempMatrix, cell.regionY, cell.regionX, value, rowIndex, colIndex)

        if (existsInRow || existsInColumn || existsInRegion) {
            return tempMatrix
        }

        if (focusTarget) {
            focusTarget.blur()
        }

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

        return getMatrixWithUpdatedProperty(tempMatrix, rowIndex, colIndex, 'value', value)

    }

    function getMatrixWithUpdatedProperty(tempMatrix, rowIndex, colIndex, property, value) {
        return tempMatrix.map( (row, currentRowIndex) => {
            if ( rowIndex === currentRowIndex) {
                return row.map( (cell, currentColIndex) => {
                    if (colIndex === currentColIndex) {
                        cell[property] = value
                    }
                    return cell
                })
            }
            return row
        })
    }

    function cellSelected(rowIndex, colIndex, focusTarget) {
        if (!matrix[rowIndex][colIndex].locked) {
            let remainings = getRemainings(matrix[rowIndex][colIndex])
            setSelectedCellRemainings(remainings)
            setPossibilities(getPossibilitiesForSelected(matrix, remainings, matrix[rowIndex][colIndex]))
        }
        else {
            focusTarget.blur()
        }
    }

    function numberExistsInRow(tempMatrix, rowIndex, number, originalColIndex) {
        let colIndex = tempMatrix[rowIndex].findIndex( cell => cell.value === number)

        if (colIndex === -1) {
            return false
        }

        setMatrix(getMatrixWithUpdatedProperty(tempMatrix, rowIndex, colIndex, 'highlighted', true))
        if (colIndex !== originalColIndex) {
            setTimeout( () => {
                setMatrix(getMatrixWithUpdatedProperty(tempMatrix, rowIndex, colIndex, 'highlighted', false))
            }, animationDuration)
        }

        return true
    }

    function numberExistsInColumn(tempMatrix, colIndex, number, originalRowIndex) {
        let rowIndex = tempMatrix.reduce( (acc,row) => {
            acc.push(row[colIndex])
            return acc
        }, []).findIndex( cell => cell.value === number)

        if (rowIndex === -1) {
            return false
        }

        setMatrix(getMatrixWithUpdatedProperty(tempMatrix, rowIndex, colIndex, 'highlighted', true))
        if (rowIndex !== originalRowIndex) {
            setTimeout( () => {
                setMatrix(getMatrixWithUpdatedProperty(tempMatrix, rowIndex, colIndex, 'highlighted', false))
            }, animationDuration)
        }

        return true
    }

    function numberExistsInRegion(tempMatrix, regionY, regionX, number, originalRowIndex, originalColIndex) {
        let cell = tempMatrix.filter( (row, currentRowIndex) => {
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

        setMatrix(getMatrixWithUpdatedProperty(tempMatrix, rowIndex, colIndex, 'highlighted', true))
        if (rowIndex !== originalRowIndex) {
            setTimeout( () => {
                setMatrix(getMatrixWithUpdatedProperty(tempMatrix, rowIndex, colIndex, 'highlighted', false))
                }, animationDuration)
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

    function getRemainings(cell) {
        return [1,2,3,4,5,6,7,8,9].filter( number => {
            return cell.remainingPerRow.includes(number)
                && cell.remainingPerCol.includes(number)
                && cell.remainingPerRegion.includes(number)
        })
    }

    function getPossibilitiesForSelected(tempMatrix, remainings, cell) {
        return remainings.map( number => {
            let row = JSON.parse(JSON.stringify(tempMatrix[cell.rowIndex]))
            let col = JSON.parse(JSON.stringify(tempMatrix.map( currentRow => {
                return currentRow[cell.colIndex]
            })))
            let region = JSON.parse(JSON.stringify(tempMatrix.reduce( (acc, currentRow) => {
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
                locked={cell.locked}
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
        <>
            <div className={styles.board}>
                {board}
            </div>
            <GameGenerator
                matrix={matrix}
                setMatrix={setMatrix}
                getUpdatedMatrix={getUpdatedMatrix}
                getCleanMatrix={getCleanMatrix}
                getRemainings={getRemainings}
                getPossibilitiesForSelected={getPossibilitiesForSelected}
                getRegionIndex={getRegionIndex}
                setCompleteMatrix={setCompleteMatrix}
                setCleanMatrix={setCleanMatrix}
            />
        </>
    )
}

export default Game
