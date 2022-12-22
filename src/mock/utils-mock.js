export const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
