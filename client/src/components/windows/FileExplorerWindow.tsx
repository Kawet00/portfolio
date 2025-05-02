import { FC } from 'react';
import { useWindowStore } from '@/lib/window';

const items = [
  { id: 'snake' as const, label: 'Snake', icon: 'ri-gamepad-line' },
  { id: 'tetris' as const, label: 'Tetris', icon: 'ri-gamepad-line' },
];

const FileExplorerWindow: FC = () => {
  const openWindow = useWindowStore(s => s.openWindow);
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {items.map(item => (
        <div
          key={item.id}
          className="flex flex-col items-center cursor-pointer hover:bg-gray-700 p-2 rounded"
          onClick={() => openWindow(item.id)}
        >
          <i className={`${item.icon} text-3xl`} />
          <span className="mt-1 text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default FileExplorerWindow;
