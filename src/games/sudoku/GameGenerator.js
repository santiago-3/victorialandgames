import {  useState, useEffect } from 'react'

function GameGenerator({matrix, updateValue, getRemainings}) {

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
        console.log(smallerValue)

        console.log('smaller value', smallerValue)

        const candidateCells = cells.filter( cell => {
            let remainingsLength = getRemainings(cell).length
            return remainingsLength === smallerValue && cell.value === ''
        })

        if (smallerValue == 2) {
            return
        }

        if(candidateCells.length > 0) {
            const selectedCellIndex = Math.floor(Math.random() * (candidateCells.length-1))

            const selectedCell = candidateCells[selectedCellIndex]
            const selectedCellRemainings = getRemainings(selectedCell)
            const newValueIndex = Math.floor(Math.random() * (selectedCellRemainings.length-1))
            const newValue = selectedCellRemainings[newValueIndex]

            updateValue(selectedCell.rowIndex, selectedCell.colIndex, 48 + newValue, null)

            setTimeout(() => { generateNextStep() }, 400)
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
