import { Link } from 'react-router-dom';
import './Home.css'
import React, { useState} from 'react';

export const Home = () => {
    const [input,setInput] = useState<string>('');
    const handleInput = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setInput(e.target.value);
    }




  return (
    <>
      <h1 className="heading">GOOP</h1>
      <div className="options">
        <input type="text" className="goop-input" onInput={handleInput} placeholder='Enter Room name'/>
        <div className="option-button">
          <Link to={`/room/${input}`}><button>Go to room😋</button></Link>

        </div>
      </div>
    </>
  );
};
