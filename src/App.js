import React, { useReducer } from "react";
import "./App.css"
import ButtonDigit from "./components/ButtonDigit";
import ButtonOperation from "./components/ButtonOperation";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {
  switch(type) {
    
    case ACTIONS.ADD_DIGIT:
      console.log(state.currentOperand)
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === '0' && state.currentOperand === '0') return state
      if (payload.digit === '.' && state.currentOperand == null) {
        return {
          ...state,
          currentOperand: '0.'
        }
      }
      if (payload.digit === '.' && state.currentOperand.includes('.')) return state
      if (payload.digit !== '.' && state.currentOperand === '0') {
        return {
          ...state,
          currentOperand: payload.digit
        }
      }
      
      
      
      return {
        ...state,
      currentOperand: `${state.currentOperand || ''}${payload.digit}`}


    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return {...state, currentOperand: null}
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    

    case ACTIONS.EVALUATE:
        if (state.operation == null || 
          state.currentOperand == null ||
          state.previousOperand == null
        ) {
          return state
        }
      
        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state)
        }
  }
}

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ''
  let computation = ''
  switch (operation) {
    case '+':
      computation = prev + current
      break
    case '-':
      computation = prev - current
      break
    case '÷':
      computation = prev / current
      break 
    case '*':
      computation = prev * current
      break
  }

  return computation.toString()
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})
  return (
    <div className="App">
      <div className="calculator-container">
        <div className="display">
          <div className="previous-operand">{previousOperand} {operation}</div>
          <div className="current-operand">{currentOperand}</div>
        </div>
        
      <button onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>

      <ButtonOperation operation='-/+' dispatch={dispatch} />
      <ButtonOperation operation='÷' dispatch={dispatch} />

      <ButtonDigit digit='1' dispatch={dispatch}/>
      <ButtonDigit digit='2' dispatch={dispatch}/>
      <ButtonDigit digit='3' dispatch={dispatch}/>
      
      <ButtonOperation operation='*' dispatch={dispatch}/>
      
      <ButtonDigit digit='4' dispatch={dispatch}/>
      <ButtonDigit digit='5' dispatch={dispatch}/>
      <ButtonDigit digit='6' dispatch={dispatch}/>
      
      <ButtonOperation operation='+' dispatch={dispatch}/>

      <ButtonDigit digit='7' dispatch={dispatch}/>
      <ButtonDigit digit='8' dispatch={dispatch}/>
      <ButtonDigit digit='9' dispatch={dispatch}/>
    
      <ButtonOperation operation='-' dispatch={dispatch}/>

      <ButtonDigit digit='.' dispatch={dispatch}/>
      <ButtonDigit digit='0' dispatch={dispatch}/>

      <button className="btn-long" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
      </div>
      
    </div>
  );
}

export default App;
