// utils/getPrizesByDraw.js
export const getPrizesByDrawType = (drawType, allPrizes) => {
  return allPrizes.filter(prize => prize.Type === drawType);
};
