'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard'); // `replace` avoids adding a new entry to browser history
  }, [router]);

  return null;
}
