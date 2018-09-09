import * as React from "react";
import {GameState} from "./constants";

enum CellValue {
    EMPTY = "",
    PLAYER = "X",
    AI = "O"
}

type Table = CellValue[]

class BoardState {
    constructor(public cells: Table, public gameState: GameState) {
    };
}

export class Board extends React.Component<Object, BoardState> {

    constructor(props: Object) {
        super(props);
        this.state = this.getInitState();
    }

    private getInitState() {
        let cells = Array.apply(null, Array(9)).map(() => CellValue.EMPTY);
        return new BoardState(cells, GameState.IN_PROCESS);
    }

    private resetState() {
        this.setState(this.getInitState());
    }

    public componentDidMount() {
        window.addEventListener("restart", () => this.resetState());
    }

    public componentWillUnmount() {
        window.removeEventListener("restart", () => this.resetState());
    }

    // Fire a global event notifying GameState changes
    private handleGameStateChange() {
        let event = new CustomEvent("gameStateChange", {"detail": this.state.gameState});
        event.initEvent("gameStateChange", false, true);
        window.dispatchEvent(event);
    }

    // check the game state - use the latest move
    private checkGameState(cells: Table, latestPos: number, latestVal: CellValue): GameState {
        if (this.state.gameState !== GameState.IN_PROCESS) {
            return this.state.gameState;
        }

        // check row
        let result = this.check3Cells(cells, 3 * Math.floor(latestPos / 3),
            3 * Math.floor(latestPos / 3) + 1, 3 * Math.floor(latestPos / 3) + 2);
        if (result) {
            return result;
        }

        // check col
        result = this.check3Cells(cells, latestPos % 3, latestPos % 3 + 3, latestPos % 3 + 6);
        if (result) {
            return result;
        }

        // check diag
        result = this.check3Cells(cells, 0, 4, 8);
        if (result) {
            return result;
        }
        result = this.check3Cells(cells, 2, 4, 6);
        if (result) {
            return result;
        }

        // check draw - if all cells are filled
        if (this.findAllEmptyCells(cells).length === 0) {
            return GameState.DRAW;
        }

        return GameState.IN_PROCESS;
    }

    // check if 3 cells have same non-empty val - return the winner state; otherwise undefined
    private check3Cells(cells: Table, pos0: number, pos1: number, pos2: number): GameState | undefined {
        if (cells[pos0] == cells[pos1] &&
            cells[pos1] == cells[pos2] &&
            cells[pos0] != CellValue.EMPTY) {
            if (cells[pos0] == "X") {
                return GameState.PLAYER_WIN;
            }
            return GameState.AI_WIN;
        }
        else {
            return undefined;
        }
    }

    // list all empty cell positions
    private findAllEmptyCells(cells: Table) {
        return cells.map((v, i) => {
            if (v === "") {
                return i;
            }
            else {
                return -1;
            }
        }).filter(v => {
            return v !== -1
        });
    }

    // make a move
    private move(pos:number, val:CellValue, callback?:() => void) {
        if (this.state.gameState === GameState.IN_PROCESS &&
            this.state.cells[pos] === CellValue.EMPTY) {
            let newCells = this.state.cells.slice();
            newCells[pos] = val;
            let oldState = this.state.gameState;
            this.setState({cells: newCells, gameState: this.checkGameState(newCells, pos, val)}, () => {
                if (this.state.gameState !== oldState) {
                    this.handleGameStateChange();
                }
                if (callback) {
                    callback.call(this);
                }
            });
        }
    }

    // handle a new move from player
    private handleNewPlayerMove(pos:number) {
        this.move(pos, CellValue.PLAYER, () => {
            // AI make a random move following player's move
            let emptyCells = this.findAllEmptyCells(this.state.cells);
            let pos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.move(pos, CellValue.AI);
        });
    }

    render() {
        let cells = this.state.cells.map((v, i) => {
            return (
                <Cell key={i} pos={i} val={v} handleMove={() => this.handleNewPlayerMove(i)}/>
            )
        });

        return (
            <div className="board">
                {cells}
            </div>
        )
    }
}

interface CellProps {
    handleMove:()=>void;
    val:CellValue;
    pos:number;
}

class Cell extends React.Component<CellProps, {}> {

    // position of cell to className
    private posToClassName(pos:number) {
        let className = "cell";
        switch (Math.floor(pos / 3)) {
            case 0:
                className += " top";
                break;
            case 2:
                className += " bottom";
                break;
            default:
                break;
        }
        switch (pos % 3) {
            case 0:
                className += " left";
                break;
            case 2:
                className += " right";
                break;
            default:
                break;
        }
        return className;
    }

    handleClick() {
        this.props.handleMove();
    }

    render() {
        let name = this.props.val;
        if (this.props.val == CellValue.PLAYER) {
            name = CellValue.EMPTY;
        }
        return <div className={this.posToClassName(this.props.pos)} onClick={() => this.handleClick()}>
            <div className={name}> {this.props.val} </div>
        </div>
    }
}
