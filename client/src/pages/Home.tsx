import { useEffect } from 'react';
import Desktop from '@/components/Desktop';

interface HomeProps {
  onLogout?: () => void;
}

export default function Home({ onLogout }: HomeProps) {
  return <Desktop onLogout={onLogout} />;
}
