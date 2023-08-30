import {  useState, useEffect } from 'react'

function GameGenerator({
    matrix,
    setMatrix,
    getUpdatedMatrix,
    getRemainings,
    getPossibilitiesForSelected,
    getCleanMatrix,
    getRegionIndex,
    setCompleteMatrix
}) {

    let [started, setStarted] = useState(false)

    function flattenMatrix(tempMatrix) {
        return tempMatrix.reduce( (acc, row) => {
            return acc.concat(row)
        }, [])
    }

    function generateNextStep(tempMatrix, count) {
        if (count > 80) {
            setCompleteMatrix(JSON.stringify(tempMatrix))
            startRemoving(tempMatrix)
            return
        }

        const cells = flattenMatrix(tempMatrix)
        let smallerValue = cells.reduce( (acc, cell) => {
            let remainingsLength = getRemainings(cell).length
            if (remainingsLength < acc && cell.value === '') {
                return remainingsLength
            }
            return acc
        }, 9)

        if (smallerValue > 0) {
            const candidateCells = cells.filter( cell => {
                let remainingsLength = getRemainings(cell).length
                return remainingsLength === smallerValue && cell.value === ''
            })

            const selectedCellIndex = Math.floor(Math.random() * (candidateCells.length-1))

            const selectedCell = candidateCells[selectedCellIndex]
            const selectedCellRemainings = getRemainings(selectedCell)

            const possibilitiesForSelected = getPossibilitiesForSelected(tempMatrix, selectedCellRemainings, selectedCell)

            const highestSmallest = possibilitiesForSelected.reduce( (acc, pos) => {
                if (pos.smaller > acc) {
                    return pos.smaller
                }
                return acc
            }, 0)

            const candidatesWithHighestSmaller = possibilitiesForSelected.filter( pos => {
                return pos.smaller === highestSmallest
            }).map( ({number}) => number)

            const newValueIndex = Math.floor(Math.random() * (candidatesWithHighestSmaller.length))
            let newValue = candidatesWithHighestSmaller[newValueIndex]

            tempMatrix = getUpdatedMatrix(tempMatrix, selectedCell.rowIndex, selectedCell.colIndex, newValue)

            generateNextStep(tempMatrix, count+1)
        }
        else {
            console.log('finished')
            setStarted(started+1)
        }

    }

    useEffect( () => {
        setStarted(1)
    }, [])

    useEffect( () => {
        if (started > 0 && started < 6) {
            console.log(`starting ${started}`)
            generateNextStep(getCleanMatrix(), 0)
        }
    }, [started])

    function startRemoving(tempMatrix) {
        const coordsByArea = Array.from( { length: 9 }, (_,i) => i ).map( areaIndex => {
            let cells = Array.from( { length: 9 }, (_,i) => i).map( squareIndex => {
                const yIndex = Math.floor(squareIndex / 3)
                const xIndex = squareIndex % 3
                return [yIndex, xIndex]
            })
            return {
                areaY : Math.floor(areaIndex / 3),
                areaX : areaIndex % 3,
                cells
            }
        })

        remove(coordsByArea, tempMatrix, 2, 36, 19)
    }

    function remove(coordsByArea, tempMatrix, minPerArea, itemsToSweep, itemsToRemove){

        let randomAreaIndex

        if (itemsToSweep > 0) {
            const biggestAmountOfNumbersPerArea = coordsByArea.reduce((acc, area) => {
                if (area.cells.length > acc) {
                    return area.cells.length
                }
                return acc
            }, 0)

            const candidateAreasIndexes = coordsByArea
                .map( (area, areaIndex) => {
                    return {
                        squares: area.cells.length,
                        index: areaIndex
                    }
                })
                .filter( ({squares}) => squares === biggestAmountOfNumbersPerArea )
                .map( ({index}) => index)

            const areaIndexesIndex = Math.floor(Math.random() * (candidateAreasIndexes.length))
            randomAreaIndex = candidateAreasIndexes[areaIndexesIndex]
            itemsToSweep--
        }
        else {
            randomAreaIndex = Math.floor(Math.random() * (coordsByArea.length))
            itemsToRemove--
        }

        const randomArea = coordsByArea[randomAreaIndex]
        const areaLength = randomArea.cells.length

        const randomSquareIndex = Math.floor(Math.random() * areaLength)

        const [relX, relY] = randomArea.cells[randomSquareIndex]
        const rowIndex = (randomArea.areaY * 3) + relY
        const colIndex = (randomArea.areaX * 3) + relX

        coordsByArea[randomAreaIndex].cells.splice(randomSquareIndex, 1)

        if (coordsByArea[randomAreaIndex].cells.length === minPerArea) {
            coordsByArea.splice(randomAreaIndex, 1)
        }

        tempMatrix = tempMatrix.map( (row, currentRowIndex) => {
            if ( rowIndex === currentRowIndex) {
                return row.map( (cell, currentColIndex) => {
                    if (colIndex === currentColIndex) {
                        return {
                            regionY     : getRegionIndex(rowIndex),
                            regionX     : getRegionIndex(colIndex),
                            rowIndex    : rowIndex,
                            colIndex    : colIndex,
                            value       : ' ',
                            highlighted : false,
                            locked      : false,
                            remainingPerRow     : [1,2,3,4,5,6,7,8,9],
                            remainingPerCol     : [1,2,3,4,5,6,7,8,9],
                            remainingPerRegion  : [1,2,3,4,5,6,7,8,9],
                        }
                    }
                    return cell
                })
            }
            return row
        })

        setMatrix(tempMatrix)
        if (itemsToRemove > 0) {
            remove(coordsByArea, tempMatrix, minPerArea, itemsToSweep, itemsToRemove)
        }

    }
}

export default GameGenerator
