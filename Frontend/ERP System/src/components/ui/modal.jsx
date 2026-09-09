// ✅ لو مش عندك الـ utils file، استخدم ده بدل `cn`:

// Option 1: Remove cn and use template literals directly
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ar } from '@/constants/ar'
import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'default',
  showCloseButton = true,
  className = '',
  variant = 'default',
  icon = null,
}) {
  const sizeClasses = {
    sm: 'sm:max-w-md',
    default: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
    full: 'sm:max-w-[90vw]',
  }

  const variantStyles = {
    default: {
      header: 'from-white to-gray-50/80',
      title: 'text-gray-900',
      border: 'border-gray-100',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-500',
    },
    success: {
      header: 'from-green-50 to-green-100/50',
      title: 'text-green-800',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    error: {
      header: 'from-red-50 to-red-100/50',
      title: 'text-red-800',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    warning: {
      header: 'from-yellow-50 to-yellow-100/50',
      title: 'text-yellow-800',
      border: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
  }

  const styles = variantStyles[variant] || variantStyles.default

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`
          ${sizeClasses[size]} 
          max-h-[90vh] 
          overflow-y-auto
          flex 
          flex-col
          p-0
          gap-0
          rounded-2xl
          shadow-2xl
          border-0
          animate-in fade-in-0 zoom-in-95 duration-200
          ${className}
        `}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={() => onOpenChange(false)}
            className="
              absolute right-4 top-4 z-20
              rounded-full p-1.5
              hover:bg-gray-100
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-300
            "
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        )}

        {/* Header */}
        <DialogHeader className={`
          sticky top-0 z-10
          bg-gradient-to-r
          ${styles.header}
          backdrop-blur-sm
          px-6 py-5 pb-3
          border-b
          ${styles.border}
          shrink-0
          rounded-t-2xl
        `}>
          <div className="flex items-center gap-3">
            {icon && (
              <div className={`
                flex items-center justify-center
                w-10 h-10 rounded-full
                ${styles.iconBg}
                shrink-0
              `}>
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className={`
                text-xl font-bold
                ${styles.title}
                truncate
              `}>
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-sm text-gray-500 mt-0.5">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-5 flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <DialogFooter className={`
            sticky bottom-0 z-10
            bg-white/95 backdrop-blur-sm
            px-6 py-4 pt-3
            border-t
            ${styles.border}
            shrink-0
            rounded-b-2xl
            flex gap-3 flex-row justify-end
            shadow-[0_-4px_20px_rgba(0,0,0,0.03)]
          `}>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = ar.common.save,
  cancelLabel = ar.common.cancel,
  loading = false,
  size = 'default',
  submitVariant = 'default',
  submitClassName = '',
  cancelClassName = '',
  variant = 'default',
  icon = null,
  showSubmit = true,
  showCancel = true,
  disabled = false,
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size={size}
      variant={variant}
      icon={icon}
      footer={
        <>
          {showCancel && (
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={loading}
              className={`
                min-w-[100px]
                font-medium
                hover:bg-gray-50
                transition-all duration-200
                ${cancelClassName}
              `}
            >
              {cancelLabel}
            </Button>
          )}
          {showSubmit && (
            <Button 
              onClick={onSubmit} 
              disabled={loading || disabled}
              variant={submitVariant}
              className={`
                min-w-[120px]
                font-medium
                transition-all duration-200
                hover:scale-[1.02]
                active:scale-[0.98]
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                ${submitClassName}
              `}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {ar.common.saving || 'جاري الحفظ...'}
                </div>
              ) : (
                submitLabel
              )}
            </Button>
          )}
        </>
      }
    >
      {children}
    </Modal>
  )
}

// Confirm Dialog
export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'تأكيد',
  description = 'هل أنت متأكد من هذا الإجراء؟',
  onConfirm,
  confirmLabel = 'تأكيد',
  cancelLabel = ar.common.cancel,
  loading = false,
  variant = 'warning',
}) {
  const variantIcons = {
    warning: <AlertCircle className="h-6 w-6" />,
    error: <AlertCircle className="h-6 w-6" />,
    success: <CheckCircle className="h-6 w-6" />,
    default: null,
  }

  const variantColors = {
    warning: 'warning',
    error: 'error',
    success: 'success',
    default: 'default',
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      variant={variantColors[variant] || 'default'}
      icon={variantIcons[variant] || null}
      footer={
        <>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={loading}
            className="min-w-[80px]"
          >
            {cancelLabel}
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={loading}
            variant={variant === 'error' ? 'destructive' : 'default'}
            className="min-w-[80px]"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              confirmLabel
            )}
          </Button>
        </>
      }
    >
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </Modal>
  )
}

// Success Modal
export function SuccessModal({
  open,
  onOpenChange,
  title = 'نجاح',
  description = 'تمت العملية بنجاح',
  buttonLabel = 'حسناً',
  onButtonClick,
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      variant="success"
      icon={<CheckCircle className="h-6 w-6" />}
      footer={
        <Button 
          onClick={onButtonClick || (() => onOpenChange(false))}
          className="min-w-[100px]"
        >
          {buttonLabel}
        </Button>
      }
    >
      <div className="text-center py-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3" />
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </Modal>
  )
}