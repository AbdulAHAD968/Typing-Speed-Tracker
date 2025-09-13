import TypingTest from '@/components/TypingTest';
import AuthGuard from '@/components/AuthGuard';

export default function TypingTestPage() {
  return (
    <AuthGuard>
      <TypingTest />
    </AuthGuard>
  );
}