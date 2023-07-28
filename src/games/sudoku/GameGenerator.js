import {  useState, useEffect } from 'react'

function GameGenerator({matrix, updateValue, getRemainings, getPossibilitiesForSelected}) {

    let [started, setStarted] = useState(false)

    function flattenMatrix(tempMatrix) {
        return tempMatrix.reduce( (acc, row) => {
            return acc.concat(row)
        }, [])
    }
    
    function generateNextStep() {

        const cells = flattenMatrix(matrix)
        let smallerValue = cells.reduce( (acc, cell) => {
            let remainingsLength = getRemainings(cell).length
            if (remainingsLength < acc && cell.value === '') {
                return remainingsLength
            }
            return acc
        }, 9)

        const candidateCells = cells.filter( cell => {
            let remainingsLength = getRemainings(cell).length
            return remainingsLength === smallerValue && cell.value === ''
        })

        if(candidateCells.length > 0) {
            const selectedCellIndex = Math.floor(Math.random() * (candidateCells.length-1))

            const selectedCell = candidateCells[selectedCellIndex]
            const selectedCellRemainings = getRemainings(selectedCell)

            const possibilitiesForSelected = getPossibilitiesForSelected(selectedCellRemainings, selectedCell)

            const highestSmallest = possibilitiesForSelected.reduce( (acc, pos) => {
                if (pos.smaller > acc) {
                    return pos.smaller
                }
                return acc
            }, 0)

            const candidatesWithHighestSmaller = possibilitiesForSelected.filter( pos => {
                return pos.smaller === highestSmallest
            }).map( ({number}) => number)

            const newValueIndex = Math.floor(Math.random() * (candidatesWithHighestSmaller.length-1))
            const newValue = candidatesWithHighestSmaller[newValueIndex]

            updateValue(selectedCell.rowIndex, selectedCell.colIndex, 48 + newValue, null)

            setTimeout(() => { generateNextStep() }, 100)
        }
        else {
            console.log('finished')
        }

    }

    useEffect( () => {
        setStarted(true)
    }, [])

    useEffect( () => {
        if (started) {
            generateNextStep();
        }
    }, [started])

}

export default GameGenerator
