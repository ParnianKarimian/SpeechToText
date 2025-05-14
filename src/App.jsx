import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import SpeechToText from "./pages/SpeechToText";
import Archive from "./pages/Archive";

function App() {
  return (
    <div className="flex flex-row-reverse min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<SpeechToText />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
