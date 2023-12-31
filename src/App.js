import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Minesweeper from './games/minesweeper/GameManager.js'
import Sudoku from './games/sudoku/GameManager.js'
import Puzzles from './games/puzzles/GameManager.js'
import MainMenu from './MainMenu.js'
import './styles/App.css'

const items = {
    MINESWEEPER: 0,
    SUDOKU: 1,
    PUZZLES: 2,
}


function App() {

    const [selected, setSelected] = useState('')

    const commonProps = { items, selected, setSelected }

    return (
    <div className="App">
        <header className="App-header">
            <MainMenu {...commonProps} />
        </header>
        <div className="content">
            <BrowserRouter>
                <Routes>
                    <Route path="/minesweeper" element={ <Minesweeper {...commonProps} /> } />
                    <Route path="/sudoku" element={<Sudoku {...commonProps} />} />
                    <Route path="/puzzles" element={<Puzzles {...commonProps} />} />
                </Routes>
            </BrowserRouter>
        </div>
    </div>
    );
}

export default App
