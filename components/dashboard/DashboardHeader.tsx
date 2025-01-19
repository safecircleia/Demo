interface DashboardHeaderProps {
  user: {
    name: string | null
    accountType: string
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold gradient-text">
        Welcome, {user.name}
      </h1>
      <p className="text-gray-400 mt-2">
        {user.accountType === 'parent' 
          ? 'Manage your family settings and monitor activity'
          : 'View your activity and settings'}
      </p>
    </div>
  )
}