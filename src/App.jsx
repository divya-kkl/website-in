// import { useEffect, useRef, useState } from "react";
// import ChatbotIcon from "./components/ChatbotIcon";
// import ChatForm from "./components/ChatForm";
// import ChatMessage from "./components/ChatMessage";

// function App() {
//   const [chatHistory, setChatHistory] = useState([]);
//   const [showChatbot, setShowChatbot] = useState(false);
//   const chatBodyRef = useRef();

//   const generateBotResponse = async (history) => {
//     const formattedHistory = history
//       .map(({ role, text }) => {
//         if (role === "user") return { role: "user", parts: [{ text }] };
//         if (role === "model" || role === "assistant") return { role: "model", parts: [{ text }] };
//         return null;
//       })
//       .filter(Boolean);

//     const apiUrl = `${import.meta.env.VITE_API_URL}?key=${import.meta.env.VITE_API_KEY}`;
//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ contents: formattedHistory }),
//     };

//     try {
//       const response = await fetch(apiUrl, requestOptions);
//       const data = await response.json();

//       if (!response.ok) throw new Error(data.error?.message || "Something went wrong");

//       const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
//       const cleanText = botMessage.replace(/\*\*(.*?)\*\*/g, "$1").trim();

//       // Replace last message ("Thinking...") with actual bot response
//       setChatHistory((prev) => {
//         const updated = [...prev];
//         updated[updated.length - 1] = { role: "model", text: cleanText };
//         return updated;
//       });
//     } catch (error) {
//       console.error("API Error:", error);
//       setChatHistory((prev) => {
//         const updated = [...prev];
//         updated[updated.length - 1] = {
//           role: "model",
//           text: "Something went wrong. Please try again.",
//         };
//         return updated;
//       });
//     }
//   };


//   useEffect(() => {

//     // Auto scroll whenever chat history updates
//     chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
//   },[chatHistory]);


//   return (
//     <div className={`container ${showChatbot ? "show-chatbot": ""}`}>

//        <button onClick={()=> setShowChatbot(prev => !prev)} id="chatbot-toggler">
//         <span className="material-symbols-outlined">mode_comment</span>
//         <span className="material-symbols-outlined">close</span>
//        </button>

//       <div className="chatbot-popup">
//         {/* Chatbot Header */}
//         <div className="chat-header">
//           <div className="header-info">
//             <ChatbotIcon />
//             <h2 className="logo-text">Chatbot</h2>
//           </div>
//           <button className="material-symbols-outlined">keyboard_arrow_down</button>
//         </div>

//         {/* Chatbot Body */}
//         <div ref={chatBodyRef} className="chat-body">
//           <div className="message bot-message">
//             <ChatbotIcon />
//             <p className="message-text">
//               Hey there 👋 <br /> How can I help you today?
//             </p>
//           </div>

//           {/* Render chat messages */}
//           {chatHistory.map((chat, index) => (
//             <ChatMessage key={index} chat={chat} />
//           ))}
//         </div>

//         {/* Chatbot Footer */}
//         <div className="chat-footer">
//           <ChatForm
//             chatHistory={chatHistory}
//             setChatHistory={setChatHistory}
//             generateBotResponse={generateBotResponse}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;




import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const formattedHistory = history
      .map(({ role, text }) => {
        if (role === "user") return { role: "user", parts: [{ text }] };
        if (role === "model" || role === "assistant") return { role: "model", parts: [{ text }] };
        return null;
      })
      .filter(Boolean);

    const apiUrl = `${import.meta.env.VITE_API_URL}?key=${import.meta.env.VITE_API_KEY}`;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || "Something went wrong");

      const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      const cleanText = botMessage.replace(/\*\*(.*?)\*\*/g, "$1").trim();

      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "model", text: cleanText };
        return updated;
      });
    } catch (error) {
      console.error("API Error:", error);
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "model",
          text: "Something went wrong. Please try again.",
        };
        return updated;
      });
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      {/* Chat Toggle Button */}
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-outlined">
          {showChatbot ? "close" : "mode_comment"}
        </span>
      </button>

      {/* Chatbot Popup */}
      <div className="chatbot-popup">
        {/* Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button
            className="material-symbols-outlined"
            onClick={() => setShowChatbot(false)}
          >
            keyboard_arrow_down
          </button>
        </div>

        {/* Chat Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
}

export default App;


