import Papa from 'papaparse';

function getRandomWinners(csvFile, numberOfWinners) {
  return new Promise((resolve, reject) => {
    // Read the CSV file
    Papa.parse(csvFile, {
      header: true,
      complete: function(results) {
        const data = results.data;

        // Shuffle the data
        for (let i = data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [data[i], data[j]] = [data[j], data[i]];
        }

        // Get the specified number of winners
        const winners = data.slice(0, numberOfWinners);
        resolve(winners);
      },
      error: function(error) {
        reject(error);
      }
    });
  });
}

export default getRandomWinners;
