import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
  onRefund: (id: string) => void;
}

export default function RefundModal({
  isOpen,
  onClose,
  reservation,
  onRefund,
}: RefundModalProps) {
  const handleRefund = () => {
    onRefund(reservation.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogDescription className="sr-only">
          이 대화 상자는 환불 처리에 대해 보여줍니다.
        </DialogDescription>
        <DialogHeader>
          <DialogTitle>환불 처리</DialogTitle>
        </DialogHeader>
        <div id="refund-desc" className="space-y-2 text-sm text-gray-500">
          <p>예매 ID: {reservation?.id}</p>
          <p>회원 이름: {reservation?.buyerName}</p>
          <p>
            결제 금액:{' '}
            {typeof reservation?.price === 'number'
              ? reservation.price.toLocaleString()
              : Number(reservation?.price || 0).toLocaleString()}
            원
          </p>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button variant="default" onClick={handleRefund}>
            환불 처리
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}