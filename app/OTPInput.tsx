"use client";
import {useState, useContext, createContext, useEffect, useRef} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OTPInputContext = createContext<{
  activeBox: number
  done: boolean
} | null>(null);

const useOTPInput = () => {
  const context = useContext(OTPInputContext);
  if(!context) {
    throw new Error("OTPContext not defined");
  }
  
  return {
    ...context
  };
}

interface OTPInputProps {
  length?: number
}
export default function OTPInput({length = 4}: OTPInputProps){
  const [activeBox, setActiveBox] = useState<number>(0);
  const [value, setValue] = useState<string[]>([]);
  
  const done = activeBox === length;
  
  const addValue = (key:string) => {
    if(value.length === length){
      return;
    }
    const newValue = [...value, key];
    setValue(newValue);
  }
  
  const removeValue = () => {
    const newValue = [...value];
    newValue.pop();
    setValue(newValue);
  }

  useEffect(() => {
    
    function handleKeyPress(event: KeyboardEvent){
      if(activeBox === length){
        return;
      }
      setActiveBox(prev => prev+1);
      addValue(event.key)
      console.log(event.key);
    }
    
    function handleBackSpace(event: KeyboardEvent){
      if(event.key === 'Backspace'){
        if (activeBox === 0) {
          return
        }
        setActiveBox(prev => prev-1);
        removeValue();
        console.log('what');
      }
    }

    document.addEventListener('keydown', handleBackSpace);
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleBackSpace);
      document.removeEventListener('keypress', handleKeyPress);
    };
  });

  return (
    <OTPInputContext.Provider value={{activeBox, done}}>
      <div className="flex items-center justify-center gap-4">
        {[...Array(length)].map((_, index) => (
          <OTPInput.Box key={index} pos={index}/>
        ))}
      </div>
    </OTPInputContext.Provider>
  );
}

OTPInput.Box = ({pos}:{pos:number}) => {
  const {activeBox, done}  = useOTPInput();
  const ref = useRef<HTMLInputElement>(null) 
  
  useEffect(() => {
    const handler = () => {
      ref.current?.focus();
    }
    ref.current?.addEventListener('click', handler)
    return () => {
      ref.current?.removeEventListener('click', handler)
    }
  },[]);

  const active = activeBox === pos;
  const hasValue = activeBox > pos;
  
  return (
    <div className="relative w-7 h-9 bg-neutral-950 rounded-md">
      {/* just to make mobile browser happy */}
      <input 
        ref={ref}
        className='absolute opacity-0 h-full w-full top-0 bg-transparent border-0'
      />
      {/* --------------------------------- */}
      <div className="relative flex justify-center items-center h-full w-full overflow-hidden">
        {/* The Line */}
        {active?(
          <motion.div
            layoutId='movingLine'
            transition={{
              layout: {duration:0.2},
              ease: [0.32, 0.72, 0, 1],
            }}
            className={`absolute inset-x-1 h-[1px] rounded-full bottom-1 bg-cyan-400`}
          />
        ):null}
        {/* The Dot */}
        <AnimatePresence>
          {hasValue?(
            <motion.div
              className={`h-2 w-2 ${done?'bg-green-400':'bg-neutral-200'} rounded-full`}
              initial={{y:30}}
              animate={{y:0}}
              exit={{y:30}}
            />
          ):null}
        </AnimatePresence>
      </div>
      {/* The Moving Box */}
      {active?(
        <motion.div
          layoutId='movingBox'
          transition={{
            layout: {duration:0.4},
            ease: [0.32, 0.72, 0, 1],
          }}
          className={`absolute z-10 -inset-[1px] border border-cyan-400 bg-cyan-400/10 rounded-md`}
        />
      ):null}
      {/* The completion box animation*/}
      {done?(
        <motion.div
          initial={{opacity: 1, scale: 1}}
          animate={{opacity: 0, scale: 1.3}}
          className={`absolute -inset-[1px] border border-cyan-400 bg-cyan-400/10 rounded-md`}
        />
      ):null}
    </div>
  );

}