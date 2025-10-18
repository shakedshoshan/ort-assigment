// Utility function to format the created_at timestamp
export const formatCreatedTime = (createdAt: string): string => {
    try {
      const date = new Date(createdAt);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Unknown time';
    }
  };
  
  // Utility function to format the close_date timestamp
  export const formatCloseTime = (closeDate: string | null | undefined): string => {
    if (!closeDate) return '';
    try {
      const date = new Date(closeDate);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Unknown time';
    }
  };