import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface AccountTypeSelectorProps {
  value: 'parent' | 'child'
  onChange: (value: 'parent' | 'child') => void
}

export default function AccountTypeSelector({ value, onChange }: AccountTypeSelectorProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange as (value: string) => void}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="parent" id="parent" />
        <Label htmlFor="parent">I am a Parent</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="child" id="child" />
        <Label htmlFor="child">I am a Child</Label>
      </div>
    </RadioGroup>
  )
}