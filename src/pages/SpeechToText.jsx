import {
  CloudArrowDownIcon,
  LinkIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";

// useClickOutside: یک هوک سفارشی گذاشتم اینجا کاربردشو داخل ارایه میگم

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose]);
}

// ***
function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "fa"
  );
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex justify-between w-40 px-4 py-2 text-sm font-medium bg-white border border-teal-500 rounded-xl shadow-sm hover:bg-gray-50"
      >
        {language === "fa" ? "فارسی" : "English"}
        <svg
          className="w-4 h-4 ml-2 mt-0.5"
          fill="none"
          viewBox="0 0 20 20"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 7l3-3 3 3m0 6l-3 3-3-3"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
          {["fa", "en"].map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {lang === "fa" ? "فارسی" : "English"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserStatusDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("میهمان");
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSelect = (val) => {
    setStatus(val);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex justify-between w-[100px] px-3 py-2 text-sm font-medium bg-white border border-teal-300 text-teal-500 rounded-full shadow-sm hover:bg-gray-50"
        dir="rtl"
      >
        {status}
        <svg
          className={`w-4 h-4 ml-2 mt-0.5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 20 20"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 7l3-3 3 3m0 6l-3 3-3-3"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right bg-white border-teal-400 rounded-full shadow-lg">
          {["میهمان", "خروج"].map((item) => (
            <button
              key={item}
              onClick={() => handleSelect(item)}
              className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SpeechToText() {
  const [activeTab, setActiveTab] = useState("record");
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunksRef = useRef([]);

  const handleRecordClick = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const formData = new FormData();
          formData.append("media_file", audioBlob, "recorded_audio.webm");

          setUploading(true);
          setUploadMessage("");

          try {
            const res = await fetch(
              "https://harf.roshan-ai.ir/api/transcribe_files/",
              {
                method: "POST",
                headers: {
                  Authorization:
                    "Token a85d08400c622b50b18b61e239b9903645297196",
                },
                body: formData,
              }
            );

            if (!res.ok) throw new Error("ارسال فایل ناموفق بود");

            const result = await res.json();
            setUploadMessage("✅ ضبط با موفقیت ارسال شد. در حال پردازش...");
            console.log("🟢 پاسخ API:", result);
          } catch (error) {
            console.error("🔴 خطا:", error);
            setUploadMessage("❌ ارسال فایل ناموفق بود.");
          } finally {
            setUploading(false);
          }
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (err) {
        alert("دسترسی به میکروفون ممکن نیست!");
        console.error(err);
      }
    } else {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("media_file", file);

    try {
      const res = await fetch(
        "https://harf.roshan-ai.ir/api/transcribe_files/",
        {
          method: "POST",
          headers: {
            Authorization: "Token a85d08400c622b50b18b61e239b9903645297196",
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("خطا در ارسال فایل");
      }

      const result = await res.json();
      setUploadMessage("✅ فایل با موفقیت ارسال شد. در حال پردازش...");
      console.log("🟢 پاسخ API:", result);
    } catch (error) {
      console.error("🔴 خطا:", error);
      setUploadMessage("❌ ارسال فایل ناموفق بود.");
    } finally {
      setUploading(false);
    }
  };

  const tabs = {
    record: {
      icon: <MicrophoneIcon className="w-8 h-8 text-white" />,
      description:
        "برای شروع به صحبت، دکمه را فشار دهید \n متن پیاده شده آن، در اینجا ظاهر شود",
      bg: "bg-teal-400",
    },
    link: {
      icon: (
        <LinkIcon className="w-8 h-8 text-white absolute left-4 top-1/2 -translate-y-1/2 bg-red-500 p-1 rounded-full" />
      ),
      input: true,
      description:
        "نشانی اینترنتی فایل حاوی گفتار (صوتی/تصویری) را وارد \n و دکمه را فشار دهید",
    },
    upload: {
      icon: <CloudArrowDownIcon className="h-6 w-6 text-white" />,
      input: false,
      description:
        "برای بارگذاری فایل گفتاری (صوتی/تصویری)، دکمه را فشار دهید \n متن پیاده شده آن، در اینجا ظاهر می‌شود",
      bg: "bg-blue-500",
    },
  };
  const tabOrder = ["record", "upload", "link"];

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="absolute top-4 left-4 z-50">
        <UserStatusDropdown />
      </div>

      <h1 className="text-2xl font-bold text-teal-400 mb-2 mt-10">
        تبدیل گفتار به متن
      </h1>
      <p className="text-gray-400 mb-6" dir="rtl">
        آوا با استفاده از هزاران ساعت گفتار با صدای افراد مختلف، <br /> زبان
        فارسی را یاد گرفته است و می‌تواند متن صحبت‌ها را بنویسد.
      </p>

      <div
        className="flex justify-center flex-row space-x-2 border-gray-200"
        dir="rtl"
      >
        {/* *** */}
        {tabOrder.map((key) => {
          const tabIcons = {
            record: <MicrophoneIcon className="w-5 h-5 text-gray-500" />,
            upload: <CloudArrowDownIcon className="h-5 w-5 text-gray-500" />,
            link: <LinkIcon className="w-5 h-5 text-gray-500" />,
          };
          const bgColor =
            key === "record"
              ? "bg-teal-500"
              : key === "upload"
              ? "bg-blue-500"
              : "bg-red-500";
          const borderColor =
            key === "record"
              ? "border-teal-500"
              : key === "upload"
              ? "border-blue-500"
              : "border-red-500";
          const labels = {
            record: "ضبط صدا",
            upload: "بارگذاری فایل",
            link: "لینک",
          };
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded transition-all ${
                activeTab === key
                  ? `${bgColor} ${borderColor} text-white`
                  : "border-transparent text-gray-400 hover:bg-teal-100 hover:text-teal-600"
              }`}
            >
              <span className="w-5 h-5">{tabIcons[key]}</span>
              <span className="text-base">{labels[key]}</span>
            </button>
          );
        })}
      </div>
      {/* *** */}
      <div
        className={`border-2 rounded-2xl p-6 shadow-md w-[653px] min-h-[429px] mx-auto flex flex-col items-center justify-center gap-4 overflow-hidden transition-all duration-300 ${
          activeTab === "record"
            ? "border-teal-500"
            : activeTab === "upload"
            ? "border-blue-500"
            : "border-red-500"
        }`}
      >
        {activeTab === "link" ? (
          <>
            <div className="relative w-80">
              {tabs[activeTab].icon}
              <input
                type="text"
                placeholder="example.com/sample.mp3"
                className="w-full pl-[60px] pr-4 py-4 border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <p className="text-gray-400 mb-6 mt-2 text-center whitespace-pre-line">
              {tabs[activeTab].description}
            </p>
          </>
        ) : activeTab === "upload" ? (
          <>
            <input
              type="file"
              accept="audio/*,video/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              className={`rounded-full p-4 ${tabs[activeTab].bg}`}
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
            >
              {tabs[activeTab].icon}
            </button>
            <p className="text-gray-600 text-center whitespace-pre-line">
              {uploading ? "در حال ارسال فایل..." : tabs[activeTab].description}
            </p>
            {uploadMessage && (
              <p
                className={`text-sm mt-2 ${
                  uploadMessage.includes("✅")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {uploadMessage}
              </p>
            )}
          </>
        ) : (
          <>
            <button
              className={`rounded-full p-4 ${tabs[activeTab].bg} ${
                isRecording ? "animate-pulse" : ""
              }`}
              onClick={handleRecordClick}
              disabled={uploading}
            >
              {tabs[activeTab].icon}
            </button>
            <p className="text-gray-600 text-center whitespace-pre-line">
              {isRecording
                ? "در حال ضبط صدا... برای توقف دوباره کلیک کنید."
                : tabs[activeTab].description}
            </p>
            {uploadMessage && (
              <p
                className={`text-sm mt-2 ${
                  uploadMessage.includes("✅")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {uploadMessage}
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-6 flex *:mx-2 w-[320px]" dir="rtl">
        <label className="text-gray-600 mt-2 inline-block">زبان گفتار :</label>
        <LanguageSelector />
      </div>
    </div>
  );
}
