import * as React from "react";
import {GameState} from "./constants"

class GameStateBarState {
    constructor(public gameState: GameState){};
}

export class GameStateBar extends React.Component<{}, GameStateBarState> {
    
    constructor(props:{}) {
        super(props);
        this.state = new GameStateBarState(GameState.IN_PROCESS);
    }
    
    private handleGameStateChange(e:CustomEvent<GameState>) {
        this.setState({gameState: e.detail});
    }
  
    private handleRestart() {
        this.setState(new GameStateBarState(GameState.IN_PROCESS));
    }

    componentDidMount() {
        window.addEventListener("gameStateChange", (e:CustomEvent<GameState>) => this.handleGameStateChange(e));
        window.addEventListener("restart", () => this.handleRestart());
    }

    componentWillUnmount() {
        window.removeEventListener("gameStateChange", (e:CustomEvent<GameState>) => this.handleGameStateChange(e));
        window.removeEventListener("restart", () => this.handleRestart());
    }
    
    render() {
        return (
            <div className="gameStateBar"> {this.state.gameState} </div> 
        )
    }
}   
