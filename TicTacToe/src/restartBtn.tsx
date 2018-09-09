import * as React from "react";

export class RestartBtn extends React.Component<{}, {}> {

    // Fire a global event notifying restart of game
    static handleClick() {
        let event = document.createEvent("Event");
        event.initEvent("restart", false, true); 
        window.dispatchEvent(event);
    }
    
    render() {
        return <a href="#" className="restartBtn" onClick={() => RestartBtn.handleClick()}>
            Restart 
        </a>;
    }
} 
