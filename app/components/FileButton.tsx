// /app/components/FileButton.tsx

interface FileButtonProps {
    fileName: string;
    onClick: (fileName: string) => void;
    className?: string; // classNameを追加
}

export function FileButton({ fileName, onClick }: FileButtonProps) {
    return (
        <button
            className="justify-start w-full min-w-[300px] max-w-[400px] text-left bg-white border border-gray-300 rounded-sm p-0.5 text-xs font-medium transition-transform duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-gray-100 cursor-pointer ${className}"
            onClick={() => onClick(fileName)}
        >
            <div className="pl-2 border-l-2 border-gray-500">
                {fileName}
            </div>
        </button>
    );
}
