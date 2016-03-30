
export const insertAt = (array, index, insert) => {
  return [...array.slice(0, index), insert, ...array.slice(index + 1)];
};

export const removeAt = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const column = (rows, items) => {
  let sorted = [], i = 0;
  for (; i < rows; i++) {
    sorted.push(items.filter((n, j) => {
        return (j + 1) % rows - i === 0;
      })
    );
  }

  return sorted;
};
