import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-48 bg-gray-800 text-white flex flex-col items-center py-8 space-y-6">
      <Link to="/" className="hover:bg-gray-700 w-full text-center py-2">
        تبدیل گفتار
      </Link>
      <Link to="/archive" className="hover:bg-gray-700 w-full text-center py-2">
        آرشیو
      </Link>
    </div>
  );
}
