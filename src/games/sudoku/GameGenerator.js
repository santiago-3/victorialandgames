import {  useState, useEffect } from 'react'

function GameGenerator({
    matrix,
    setMatrix,
    getUpdatedMatrix,
    getRemainings,
    getPossibilitiesForSelected,
    getCleanMatrix,
    getRegionIndex,
    setCompleteMatrix,
    setCleanMatrix,
}) {

    const concentrationRate = 4

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
            setStarted(started+1)
        }

    }

    useEffect( () => {
        setStarted(1)
    }, [])

    useEffect( () => {
        if (started > 0 && started < 6) {
            generateNextStep(getCleanMatrix(), 0)
        }
    }, [started])

    function startRemoving(tempMatrix) {

        const positions = Array.from( { length: 81 }, (_,pos) => ({
            pos,
            adder: 24,
            rowIndex: Math.floor(pos / 9),
            colIndex: Math.floor(pos % 9),
            regionIndex: (Math.floor(pos / 27) * 3) + Math.floor((Math.floor(pos % 9 ) / 3)),
        }))
        removeBySection(positions, tempMatrix, 56)

    }

    function removeBySection(positions, tempMatrix, remaining) {

        const biggestAdder = positions.reduce ( (bigger, {adder}) => {
            if (adder > bigger) {
                return adder
            }
            return bigger
        }, 0)

        const candidatePositions = positions
            .filter( ({adder}) => adder >= biggestAdder-concentrationRate )
            .map( ({pos}) => pos )

        const randomPositionIndex   = Math.floor(Math.random() * (candidatePositions.length))
        const randomPosition        = candidatePositions[randomPositionIndex]

        const selectedRowIndex      = positions.find(({pos}) => pos === randomPosition).rowIndex
        const selectedColIndex      = positions.find(({pos}) => pos === randomPosition).colIndex
        const selectedRegionIndex   = positions.find(({pos}) => pos === randomPosition).regionIndex

        positions = positions
            .filter( ({pos}) => pos !== randomPosition )
            .map( ({pos, adder, rowIndex, colIndex, regionIndex}) => {

                if (selectedRowIndex === rowIndex) {
                    adder--
                }

                if (selectedColIndex === colIndex) {
                    adder--
                }

                if (selectedRegionIndex === regionIndex) {
                    adder--
                }
                return {pos, adder, rowIndex, colIndex, regionIndex}
            })

        tempMatrix = tempMatrix.map( (row, currentRowIndex) => {
            if ( selectedRowIndex === currentRowIndex) {
                return row.map( (cell, currentColIndex) => {
                    if (selectedColIndex === currentColIndex) {
                        cell.value = ' '
                        cell.locked = false
                        return cell
                    }
                    return cell
                })
            }
            return row
        })

        remaining--
        if (remaining > 0){
            removeBySection(positions, tempMatrix, remaining)
        }
        else {
            setCleanMatrix(JSON.stringify(tempMatrix))
        }

        setMatrix(tempMatrix)
    }
}

export default GameGenerator
