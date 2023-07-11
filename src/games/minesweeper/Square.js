function Square({ rowNum, squareNum, hasMine, sorroundingMines, revealed, hasFlag, action, rightAction, lost, gameOver }) {
    let classes = ['square']
    let number = <></>
    let img = <></>
    if (hasFlag) {
        revealed = false
        if (gameOver && !hasMine){
            classes.push('crossedFlag')
            img = <img src="/flag-crossed.png" />
        }
        else {
            classes.push('hasFlag')
            img = <img src="/flag.png" />
        }
    }
    if (revealed) {
        classes.push('revealed')
        if (hasMine) {
            classes.push('hasMine')
            if (lost) {
                classes.push('lost')
            }
            img = <img src="/mine.png" />
        }
        else if (sorroundingMines > 0){
            number = <div class="display">{sorroundingMines}</div>
            classes.push(`mines-${sorroundingMines}`)
        }
    }
    return (
        <div className={ classes.join(' ') } onClick={action} onContextMenu={rightAction}>
            {number}
            {img}
        </div>
    )
}

export default Square
