import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import SpeechToText from "./pages/SpeechToText";
import Archive from "./pages/Archive";
import './index.css';


function App() {
  return (
    <div className="flex flex-row-reverse min-h-screen h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-8 bg-white overflow-auto">
        <Routes>
          <Route path="/" element={<SpeechToText />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
