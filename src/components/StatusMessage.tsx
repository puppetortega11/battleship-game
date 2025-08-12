interface StatusMessageProps {
  message: string;
}

export default function StatusMessage({ message }: StatusMessageProps) {
  return (
    <div className="status-message">
      {message}
    </div>
  );
}
