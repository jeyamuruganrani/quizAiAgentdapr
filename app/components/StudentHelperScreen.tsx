'use client';

interface StudentHelperScreenProps {
  onBack: () => void;
}

export default function StudentHelperScreen({ onBack }: StudentHelperScreenProps) {
  return (
    <div className="screen active">
      <div>Student Helper Screen - Coming Soon</div>
    </div>
  );
}