import React, { useEffect, useState } from "react";
import {
  PlayIcon,
  LinkIcon,
  ClipboardIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const API_URL = "https://harf.roshan-ai.ir/api/requests/";
const AUTH_TOKEN = "Token a85d08400c622b50b18b61e239b9903645297196";

const ArchivePage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        });
        if (!res.ok) throw new Error("خطا در دریافت داده‌ها");
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("آیا مطمئنی که می‌خواهی این فایل را حذف کنی؟")) return;

    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
      } else {
        throw new Error("حذف فایل با خطا مواجه شد.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      <h2 className="text-right text-2xl font-bold text-teal-400 mb-6">
        آرشیو من
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">در حال بارگذاری...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right border-separate border-spacing-y-4">
            <thead>
              <tr className="text-black text-sm flex gap-32 flex-row-reverse">
                <th className="pr-4 pl-52">نام فایل</th>
                <th>تاریخ بارگذاری</th>
                <th>نوع فایل</th>
                <th>مدت زمان</th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 ? (
                files.map((file) => (
                  <tr
                    key={file.id}
                    className="bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm"
                  >
                    <td className="px-4 py-3 text-blue-600 truncate max-w-xs">
                      {file.media_url || "—"}
                    </td>
                    <td>
                      {new Date(file.created_at).toLocaleDateString("fa-IR")}
                    </td>
                    <td>{file.duration || "—"}</td>
                    <td className="flex gap-3 justify-end pr-4">
                      <button className="text-teal-500 hover:text-teal-700">
                        <PlayIcon className="w-5 h-5" />
                      </button>
                      <button className="text-pink-500 hover:text-pink-700">
                        <LinkIcon className="w-5 h-5" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <ClipboardIcon className="w-5 h-5" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(file.id)}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 py-4">
                    هیچ فایلی وجود ندارد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;
