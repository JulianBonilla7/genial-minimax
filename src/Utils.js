class Utils{
  static array_intersect(array1, array2) {
    return array1.filter(n => array2.indexOf(n) !== -1);
  } 

  static array_difference(array1, array2) {
    return array1.filter(n => array2.indexOf(n) === -1);
  } 

  static found(array1, array2) {
    return array1.some(r=> array2.includes(r))
  }

  static random(limit){
    return Math.floor(Math.random()*limit);
  }
}

export default Utils;