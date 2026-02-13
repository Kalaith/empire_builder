import React from "react";
import { useUIStore } from "../../stores/uiStore";

const GameMessages: React.FC = () => {
  const { gameMessages } = useUIStore();

  if (gameMessages.length === 0) return null;

  return (
    <div className="game-messages fixed bottom-4 right-4 space-y-2 z-50">
      {gameMessages.map((message) => (
        <div
          key={message.id}
          className={`game-message p-3 rounded-lg shadow-lg max-w-sm animate-slide-in ${
            message.type === "success"
              ? "bg-green-100 border border-green-300 text-green-800"
              : message.type === "error"
                ? "bg-red-100 border border-red-300 text-red-800"
                : "bg-blue-100 border border-blue-300 text-blue-800"
          }`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default GameMessages;
