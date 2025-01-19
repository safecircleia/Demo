import { AccountType, AccountTypeSelectorProps } from '@/types/auth'
import { Button } from '@/components/ui/button'

export function AccountTypeSelector({ onSelect }: AccountTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold gradient-text">Choose Account Type</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          className="glass-button"
          onClick={() => onSelect('parent')}
        >
          Parent
        </Button>
        <Button
          type="button"
          className="glass-button"
          onClick={() => onSelect('child')}
        >
          Child
        </Button>
      </div>
    </div>
  )
}