function MainMenu({items, selected}) {

    let minesweeperOpts = []
    let sudokuOpts      = []

    if (selected === items.MINESWEEPER) {
        minesweeperOpts['className'] = 'selected'
    }
    else if (selected === items.SUDOKU) {
        sudokuOpts['className'] = 'selected'
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
            </ul>
        </nav>
    )

}

export default MainMenu
