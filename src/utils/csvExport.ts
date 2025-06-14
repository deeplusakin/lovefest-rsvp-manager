
export const downloadCSV = (data: any[], filename: string) => {
  // Get headers from the first object
  const headers = Object.keys(data[0] || {});
  
  // Convert data to CSV format
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header];
        // Handle null/undefined
        if (cell === null || cell === undefined) {
          return '';
        }
        // Handle numbers
        if (typeof cell === 'number') {
          return cell.toString();
        }
        // Handle strings with commas by wrapping in quotes
        if (typeof cell === 'string' && cell.includes(',')) {
          return `"${cell}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
