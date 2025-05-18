import React from 'react';

import useCounterStore from './useCounterStore';

interface TestProps {
    // Define your props here
    name?: string;
    description?: string;
}

const Test: React.FC<TestProps> = ({ name = 'Default Name', description = 'Default Description' }) => {
    const count = useCounterStore((state) => state.count);
    const decrement = useCounterStore((state) => state.decrement)
    const reset = useCounterStore((state) => state.reset)
    const texte = useCounterStore((state) => state.texte);
    const writeTexte = useCounterStore((state) => state.writeTexte);
    const readTexte = useCounterStore((state) => state.readTexte);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        writeTexte(newValue);
        // useCounterStore.setState({ texte: newValue });
    }

    return (
        <div className="test-component">

            <Display />
            <h2>{name}</h2>
            <p>{texte}</p>
            <button onClick={() => writeTexte('Hello worlddsds')}>
                Write to store
            </button>
            <input
                type="text"
                value={texte}
                onChange={handleChange}
                
                />
            <p>{description}</p>
            <button onClick={reset}>
                Click me
            </button>

            <p>Test component using Zustand store:</p>
            <p>Count: {count}</p>
            <button onClick={() => useCounterStore.setState({ count: useCounterStore.getState().count + 1 })}>
                Increment
            </button>
            <button onClick={decrement}>
                Decrement
            </button>
            <button onClick={reset}>
                Reset
            </button>
        </div>
    );
};

export default Test;

// Usage example



// Counter component using individual selectors
function Counter() {
    const count = useCounterStore((state) => state.count)
    const increment = useCounterStore((state) => state.increment)
    const decrement = useCounterStore((state) => state.decrement)
    const reset = useCounterStore((state) => state.reset)
    
    return (
        <div>
            <p>Compteur: {count}</p>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
            <button onClick={reset}>Reset</button>
        </div>
    )
}


export { Counter }

// Display component for showing information
interface DisplayProps {
    
}

const Display: React.FC<DisplayProps> = () => {
    const count = useCounterStore((state) => state.count)


    return (
        <div className={`display-component ${count}`}>
            <h3 className="display-component__title">{count}</h3>
            <div className="display-component__content">{count}</div>
        </div>
    );
};

export { Display };