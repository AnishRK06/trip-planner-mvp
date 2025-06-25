import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface LoadingOverlayProps {
  isVisible: boolean;
  title: string;
  message: string;
}

export default function LoadingOverlay({ isVisible, title, message }: LoadingOverlayProps) {
  return (
    <Dialog open={isVisible}>
      <DialogContent className="max-w-sm text-center border-0 bg-white shadow-2xl">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{message}</DialogDescription>
        <div className="p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
          <p className="text-sm text-slate-600">{message}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
