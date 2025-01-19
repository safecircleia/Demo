import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ChildSignup() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    parentEmail: ''
  })

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input 
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="age">Age</Label>
        <Input 
          id="age"
          type="number"
          value={formData.age}
          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="parentEmail">Parent's Email</Label>
        <Input 
          id="parentEmail"
          type="email"
          value={formData.parentEmail}
          onChange={(e) => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
        />
      </div>
    </form>
  )
}