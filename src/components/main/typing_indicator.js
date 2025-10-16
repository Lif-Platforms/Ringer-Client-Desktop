import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function TypingIndicator() {
    const [userTyping, setUserTyping] = useState();
    const [isTyping, setIsTyping] = useState();
  
    const { conversation_id } = useParams();
  
    async function handle_typing_update(event) {
      const username = localStorage.getItem("username");
      
      if (event.detail.user !== username && conversation_id === event.detail.id) {
        setIsTyping(event.detail.typing);
        setUserTyping(event.detail.user);
      }
    }
  
    useEffect(() => {
      document.addEventListener("User_Typing_Update", handle_typing_update)
  
      return () => {
        document.removeEventListener("User_Typing_Update", handle_typing_update);
      }
  
    }, [conversation_id])
  
    return (
      <div className={isTyping ? 'typing-indicator-open' : 'typing-indicator-closed'}>
        <p style={{textAlign: "left"}}>{userTyping} is typing...</p>
      </div>
    )
  }