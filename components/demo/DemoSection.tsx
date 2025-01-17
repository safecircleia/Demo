const getStatusIcon = (status: string) => {
  switch (status) {
    case 'SAFE':
      return <CheckCircle className="h-6 w-6 text-green-400" />;
    case 'SUSPICIOUS':
      return <AlertTriangle className="h-6 w-6 text-yellow-400" />;
    case 'DANGEROUS':
      return <AlertOctagon className="h-6 w-6 text-red-400" />;
    default:
      return null;
  }
};