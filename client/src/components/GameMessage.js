import React from "react";
import { useSelector } from "react-redux";

import capitalizeName from "../utils/capitalizeName";

const GameMessage = () => {

    const { userMessage, computerMessage } = useSelector(state=>state.gamePlay) 
    const { name } = useSelector(state=>state.user) 

    return (
        <>
            <p>{capitalizeName(name)}: {userMessage[1] === "l" ? 
                userMessage : 
                userMessage[2] === "0" ? 
                    <>
                        <span className="id-span">{userMessage.slice(0, 3)}</span>
                        {userMessage.slice(3)}
                    </>
                    :
                    <>
                        <span className="id-span">{userMessage.slice(0, 2)}</span>
                        {userMessage.slice(2)}
                    </>
                }
            </p>
            <p>Computer: {computerMessage[1] === "o" || computerMessage === "" ? 
                computerMessage : 
                computerMessage[2] === "0" ? 
                    <>
                        <span className="id-span">{computerMessage.slice(0, 3)}</span>
                        {computerMessage.slice(3)}
                    </>
                    :
                    <>
                        <span className="id-span">{computerMessage.slice(0, 2)}</span>
                        {computerMessage.slice(2)}
                    </>
                }
            </p>
        </>
          
    )
}

export default GameMessage