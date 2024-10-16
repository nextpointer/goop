import { useState } from 'react'
import './popUp.css'

interface Props{
    onSubmit:(name:string)=>void
}

export const PopUp:React.FC<Props> = ({onSubmit}) => {
    const [input,setInput] =useState<string>('');
    const handleInput = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setInput(e.target.value)
    }

    const handleSubmit =()=>{
        if(input.trim()){
            onSubmit(input.trim())
        }
    }
  return (
    <>
        <div className="pop-up-back">
            <div className="blurred-background"></div>
            <div className="pop-up-window">
                <h1>Enter your Name</h1>
                <input type="text" className='pop-up-input' onInput={handleInput} value={input} />
                <button onClick={handleSubmit} > Enter</button>
            </div>
        </div>
    </>
  )
}
