export function deepClone(array) {// новый массив с новыми массивами
  return array.map(innerArray => [...innerArray]);
}

export function delay(time) { // возвращает промис после указаного количества времени
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}