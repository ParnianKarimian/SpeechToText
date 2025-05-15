import { useState } from "react";
import MicIcon from '@mui/icons-material/Mic';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LinkIcon from '@mui/icons-material/Link';

export default function SpeechToText() {
  const [activeTab, setActiveTab] = useState("record");

  const renderContent = () => {
    switch (activeTab) {
      case "record":
        return (
          <>
            <button className="text-white px-4 py-2 rounded-xl w-[653px] h-[429px]">
              ضبط صدا
            </button>
            
          </>
        );
      case "upload":
        return <p>صفحه بارگذاری فایل اینجا</p>;
      case "link":
        return <p>صفحه لینک اینجا</p>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold text-teal-400 mb-2">
        تبدیل گفتار به متن
      </h1>
      <p className="text-gray-400 mb-6">
        آوا با استفاده از هزاران ساعت گفتار با صدای افراد مختلف، زبان فارسی را
        یاد گرفته است و می‌تواند متن صحبت‌ها را بنویسد.
      </p>

      <div className="flex justify-center space-x-2 border-gray-200">
        <button
          onClick={() => setActiveTab("link")}
          className={`py-2 px-4 rounded relative ${
            activeTab === "link"
              ? "bg-teal-500 text-white"
              : "text-gray-400 hover:bg-teal-100 hover:text-teal-600"
          }`}
        >
          لینک
          <LinkIcon fontSize="medium" />
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`py-2 px-4 rounded ${
            activeTab === "upload"
              ? "bg-teal-500 text-white"
              : "text-gray-400 hover:bg-teal-100 hover:text-teal-600"
          }`}
        >
          بارگذاری فایل
          <UploadFileIcon fontSize="medium" />
        </button>
        <button
          onClick={() => setActiveTab("record")}
          className={`py-2 px-4 rounded ${
            activeTab === "record"
              ? "bg-teal-500 text-white"
              : "text-gray-400 hover:bg-teal-100 hover:text-teal-600"
          }`}
        >
          ضبط صدا
          <MicIcon fontSize="medium" />
        </button>
      </div>

      <div className="border-2 border-teal-500 rounded-2xl p-6 shadow-md w-[653px] h-[429px] mx-auto">
        {renderContent()}
      </div>

      <div className="mt-6 text-right">
        <label className="mr-2">زبان گفتار:</label>
        <select className="border rounded-xl px-4 py-1 text-teal-600 border-teal-500">
          <option>فارسی</option>
        </select>
      </div>
    </div>
  );
}
