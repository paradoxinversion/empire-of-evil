/**
 * Creates a unique ID for an object
 */
export const getUID = () => {
  const pre = Date.now();
  const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let string = "";
  for (let i = 0; i < 8; i++) {
    string += letters[Math.floor(Math.random() * letters.length)];
  }
  const uid = `${pre}${string}`;
  return uid;
};

/**
 *
 * @param {*} frequencyMap - a key/value map of options and their frequencies
 */
export const Shufflebag = frequencyMap => {
  const getValueSet = frequencyMap => {
    let valueSet = [];
    for (let entry in frequencyMap) {
      for (let y = 0; y < frequencyMap[entry]; y++) {
        valueSet.push(entry);
      }
    }
    return valueSet;
  };

  const fmap = frequencyMap;
  let values = getValueSet(fmap);

  return {
    /**
     * Get the next value in the shufflebag.
     */
    next() {
      const selectedValue = Math.floor(Math.random() * values.length);
      const selection = values[selectedValue];
      values.splice(selectedValue, 1);
      if (values.length === 0) values = getValueSet(fmap);
      console.log(values.length);
      return selection;
    }
  };
};
