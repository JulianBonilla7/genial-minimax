import React from 'react';

const ColorScore = (props) => {
  const color = props.color;
  const score = props.score || 0;
  
  return (
    <tr>
      <td className={color} style={{"width":"30px", "background": color}}></td>
      <td style={{"padding":"0 10px"}}>{score}</td>
    </tr>
  )
}

export default ColorScore;