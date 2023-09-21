function MainMenu({items, selected}) {

    let minesweeperOpts = []
    let sudokuOpts      = []
    let puzzlesOpts     = []

    if (selected === items.MINESWEEPER) {
        minesweeperOpts['className'] = 'selected'
    }
    if (selected === items.SUDOKU) {
        sudokuOpts['className'] = 'selected'
    }
    else if (selected === items.PUZZLES) {
        puzzlesOpts['className'] = 'selected'
    }

    return (
        <nav>
            <ul>
                <li {...minesweeperOpts}>
                    <a href="/minesweeper">Mine Sweeper</a>
                </li>
                <li {...sudokuOpts}>
                    <a href="/sudoku">Sudoku</a>
                </li>
                <li {...puzzlesOpts}>
                    <a href="/puzzles">Puzzles</a>
                </li>
            </ul>
        </nav>
    )

}

export default MainMenu
