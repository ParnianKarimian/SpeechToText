import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-[166px] bg-[linear-gradient(to_bottom,#00B5A0,#00C69B)] h-[740px] rounded-lg text-white flex flex-col items-center relative *:overflow-hidden">
      <img src="/img/site Title (1).png" alt="Site Logo" className="mt-16" />
      <Link
        to="/"
        className="hover:bg-[#02816E] text-center py-2 absolute top-[267px] rounded-[10px] w-[140px]"
      >
        تبدیل گفتار
      </Link>
      <Link
        to="/archive"
        className="hover:bg-[#02816E] text-center py-2 absolute top-[354px] rounded-[10px] w-[140px]"
      >
        آرشیو
      </Link>
    </div>
  );
}
