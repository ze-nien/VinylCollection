import type React from "react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  cancelText?: string; //客製取消按鈕文字
  onClose: () => void; //點擊取消的函式
  confirmText?: string; //客製確定按鈕文字
  onConfirm?: () => void; //點擊確定時的函式
  title?: string;
  children: React.ReactNode;
}

const Modal = ({
  isOpen,
  title,
  onClose,
  cancelText,
  onConfirm,
  confirmText,
  children,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xl font-bold">{title || "提示訊息"}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
        {/* 🎯 3. 底部的按鈕操作區（直接刻在 Modal 內部） */}
        <div className="mt-6 flex justify-end gap-3">
          {/* 取消 / 繼續填寫按鈕 */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition cursor-pointer"
          >
            {cancelText}
          </button>

          {/* 確定 / 放棄離開按鈕 (只有外面有傳入 onConfirm 時才渲染) */}
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition cursor-pointer"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
