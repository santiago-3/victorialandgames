function Square({ rowNum, squareNum, hasMine, sorroundingMines, revealed, hasFlag, action, rightAction }) {
    let classes = ['square']
    let display = <></>
    if (!hasMine) {
        if (sorroundingMines > 0) {
            display = <div class="display">{sorroundingMines}</div>
            classes.push(`mines-${sorroundingMines}`)
        }
    }
    else {
        classes.push('hasMine')
        display = 'M'
    }
    if (revealed) {
        classes.push('revealed')
        hasFlag = false
    }
    if (hasFlag) {
        classes.push('hasFlag')
    }
    let flag = <img src="/flag.png" />
    return (
        <div className={ classes.join(' ') } onClick={action} onContextMenu={rightAction}>
            { revealed && display }
            { hasFlag && flag }
        </div>
    )
}

export default Square
