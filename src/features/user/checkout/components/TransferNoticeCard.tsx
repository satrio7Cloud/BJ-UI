import ServiceNoticeCard from "./ServiceNoticeCard";

interface TransferNoticeCardProps {
  serviceName: string;
  category?: string;
  isNameTransferRequired?: boolean;
}

export default function TransferNoticeCard({
  serviceName,
  category = "",
  isNameTransferRequired = false,
}: TransferNoticeCardProps) {
  return (
    <ServiceNoticeCard
      serviceName={serviceName}
      category={category}
      isNameTransferRequired={isNameTransferRequired}
    />
  );
}
