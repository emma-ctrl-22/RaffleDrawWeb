// utils
export const getPrizesByDrawType = (drawType, prizesData) => {
    switch (drawType) {
      case 'Weekly':
        return prizesData.weekly;
      case 'Monthly':
        return prizesData.monthly;
      case 'Grand prize':
        return prizesData.grand;
      default:
        return [];
    }
  };
  