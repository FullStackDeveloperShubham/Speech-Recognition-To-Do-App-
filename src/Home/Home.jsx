import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaMedium
} from "react-icons/fa";

const Home = () => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleCommand = useCallback((text) => {
    const command = text.toLowerCase();
    console.log("Command received:", command);

    if (command.startsWith("add ")) {
      const task = command.replace("add ", "").trim();
      if (task) {
        setTodos((prev) => {
          if (!prev.includes(task)) {
            console.log("Adding:", task);
            return [...prev, task];
          }
          return prev;
        });
      }
    }

    if (command.startsWith("delete ")) {
      const task = command.replace("delete ", "").trim();
      console.log("Deleting:", task);
      setTodos((prev) => prev.filter((t) => t !== task));
    }
  }, []);

  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem("todos");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    console.log("Saved to localStorage:", todos);
  }, [todos]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim();
      console.log("Heard:", transcript);
      handleCommand(transcript);
    };

    recognition.onend = () => {
      if (listening) recognition.start();
    };

    recognitionRef.current = recognition;
  }, [handleCommand, listening]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listening) {
      recognition.stop();
      console.log("Stopped listening");
    } else {
      recognition.start();
      console.log("Started listening");
    }

    setListening((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-between p-4">
      {/* Top Social Icons */}
      <div className="flex space-x-6 mt-4 text-2xl text-white">
        <a href="https://www.instagram.com/developer_shubham_/" target="_blank" rel="noreferrer">
          <FaInstagram className="hover:text-pink-400 transition" />
        </a>
        <a href="https://www.linkedin.com/in/shubham-gaikwad-62499329a/" target="_blank" rel="noreferrer">
          <FaLinkedin className="hover:text-blue-400 transition" />
        </a>
        <a href="https://x.com/ItsDevShubham" target="_blank" rel="noreferrer">
          <FaTwitter className="hover:text-sky-400 transition" />
        </a>
        <a href="https://medium.com/@s35919223" target="_blank" rel="noreferrer">
          <FaMedium className="hover:text-gray-300 transition" />
        </a>
      </div>

      {/* Main Heading */}
      <h1 className="text-3xl font-bold my-6">🎙️ Voice To-Do List</h1>

      {/* Start/Stop Button */}
      <button
        onClick={toggleListening}
        className={`px-4 py-2 rounded mb-6 text-white ${
          listening ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {listening ? "Stop Listening" : "Start Listening"}
      </button>

      {/* To-Do List */}
      <ul className="w-full max-w-md space-y-2 mb-6">
        {todos.map((todo, index) => (
          <li
            key={index}
            className="bg-gray-800 px-4 py-2 rounded shadow flex justify-between items-center"
          >
            {todo}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <footer className="text-sm text-gray-400 mt-auto mb-2">
        Developed by <span className="text-white font-semibold">Shubham Gaikwad</span>
      </footer>
    </div>
  );
};

export default Home;
