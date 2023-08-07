## 1. What is the difference between Component and PureComponent? Give an example where it might break my app.

`Component` have the possibility to manipulate props, state, and lifecycle methods, and don't implement shouldComponentUpdate by default. As a result, these components will be re-rendered whenever some state or props change.

 `PureComponent` implements the `shouldComponentUpdate()` method by default. This method compares the current props and state to the previous props and state. If there are no changes in the props or state, the component will not re-render. This can help improving performance by avoiding unnecessary re-renders.

`PureComponent` can break your app if some props that changed in the parent have a deep structure because `shouldComponentUpdate()` can only perform a shallow comparison for changes. In case of changes within nested objects, `PureComponent` will probably not trigger a re-render, resulting in the component not updating with the new props. 

## 2. Context + ShouldComponentUpdate might be dangerous. Why is that ?
If you use context and shouldComponentUpdate in the same component, you might encounter problems with re-rendering. Context generally provides data to components without prop-drilling, so shouldComponentUpdate could ignore updates that come from the context or cause excessive re-renders. 
Additionally, combining context with shouldComponentUpdate can make the component harder to maintain. Therefore, it is strongly not recommended to use them together.
Moreover, this is not required nowadays, as features like React.memo or PureComponent handle optimization and re-renders efficiently. These newer versions of optimizations resolve the problem of re-renders coming from props and context."

## 3. Describe 3 ways to pass information from a component to its PARENT.

1) The most common way to get data in the parent component from the child is by using callback functions to receive updates from the child.

 Example: 

```
import React, { useState } from 'react';

// Parrent component with state
function ParentComponent() {
  const [value, setValue] = useState('');

  const handleInputChange = (text) => {
    setValue(text);
  };

  return (
    <>
      <p>Input value from child component {message}</p>
      <ChildInput value={value} onChange={handleChildData} />
    </>
  );
}

function ChildInput ({ value, onChange }) {
  const handleChange = (e) => {
    onChange(e)
  };

  return (
    <input value={value} onChange={handleChange} />
  );
}
```

2) `props-drilling` is very similar to `callback` but more nested, not recommended.

    Example:
    ```
    import React, { useState } from 'react';

    
    // Grand Parrent component with the state should drill props for receive updates
    function GrandParentComponent() {
      const [value, setValue] = useState('');
    
      const handleInputChange = (text) => {
        setValue(text);
      };
    
      return <ParrentComponent value={value} onChange={handleChildData} />;
    }
    
    function ParrentComponent({value, onChange} ) {
      return <ChildInput value={value} onChange={handleChildData} />;
    }
    
    function ChildInput ({ value, onChange }) {
      const handleChange = (e) => {
        onChange(e)
      };
    
      return <input value={value} onChange={handleChange} />;
    }```


3) Using `context`, you can pass the data from a child component to the parent immediately without the need for a `callback` function or `props-drilling`.

  Example:
  ```
    import React, { useState } from 'react';
    import { MyContext } from './MyContext';
    
    function ParentComponent() {
      const [value, setValue] = useState('');
    
      const handleChildChange = (text) => {
        setValue(e.target.value);
      };
    
      return (
      // onInputChnage context function will be available for all childs inside 
         context provider
         
        <MyContext.Provider value={{ onInputChange: handleChildChange }}>
            <div>
                <p>Input value from child component {message}</p>
                <ChildInput />
            </div>
        </MyContext.Provider>
      );
    }
    
    function ChildInput () {
      const { onInputChange } = useContext(MyContext);
      
      const handleChange = (e) => {
        onInputChange(e.target.value)
      };
    
      return <input value={value} onChange={handleChange} />;
    }
  ```
## 4. Give 2 ways to prevent components from re-rendering.

 1) In case of class components `shouldComponentUpdate()` or `PureComponent`,
 these approaches allow you to control when the component should re-render.
 
 2) For a shallow comparison of previous and current props, you can use the higher-order component `React.memo`. If the previous and current props are equal, it will skip the re-render process.
 
 3) Using hooks like useMemo or useCallback can help manage re-rendering inside a component.
 
 4) The single-responsibility pattern (SRP) is a software design principle that states that a class or component should have only one reason to change. When applied to React components, it means that each component should have a single responsibility or purpose.
 
## 5. What is a fragment and why do we need it? Give an example where it mightbreak my app.

The main idea of React fragments is to avoid adding unnecessary DOM nodes while preserving parent-child relationships. Additionally, fragments help avoid CSS side effects that can occur when wrapping a group of elements with a particular tag, potentially affecting the layout.

There are two ways to use fragments in React, each with different styles. First, using JSX elements `<Fragment></Fragment>`,
and second, by using empty tags `<>...</>`. 
The main difference between these two styles is that `<Fragment>` can have a `key` property and can be used inside iteration rendering.

An example where fragments might break your app is when the parent provides layout directly to its children. If you wrap the children in a fragment, this relationship will be broken, and the layout might not work correctly.

```
// In this case, the styles that the wrapper provides to the child divs will not work properly.
<div className="wrapper">
    <>
        <div>1</div>
        <div>2</div>
    </>
</div>
```

## 6 Give 3 examples of the HOC pattern.
 1) One of the most commonly used HOCs before hooks is the withRouter HOC, which provides the history object to child components.
 ```
    import React from 'react';
    import { withRouter } from 'react-router-dom';
    
    const withRouterHOC = (WrappedComponent) => {
      const WithRouterComponent = (props) => {
        return <WrappedComponent {...props} />;
      };
    
      return withRouter(WithRouterComponent);
    };
    
    export default withRouterHOC;
 ```
  
 Usage: 
 ```
    import React from 'react';
    import withRouterHOC from './withRouterHOC';
    
    const MyComponent = (props) => {
      const { history, match } = props;
    
      return (
        <div>foo</div>
      );
    };

    export default withRouterHOC(MyComponent)
 ```
 
 2) Another commonly used HOC in terms of popularity is `withReducer`, which is sometimes even combined with the previously mentioned `withRouterHOC`.
 
 ```
    import React from 'react';
    import { connect } from 'react-redux';
    
    const withRedux = (WrappedComponent) => {
      // mapStateToProps maps the Redux state to component props
      const mapStateToProps = (state) => ({
       ...
      });
    
      const mapDispatchToProps = (dispatch) => ({
        ...
      });
      const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
      return ConnectedComponent;
    };
    
    export default withRedux;

 ``` 
 Usage:
 ```
    import React from 'react';
    import withRedux from './withRedux';
    
    const MyComponent = (props) => {
      const { userName, userAge, increaseCount, decreaseCount } = props;
    
      return (
        <>
            <div>{userName}</div>
            <div>{userAge}</div>
        </>
      );
    };

  export default withRedux(MyComponent);
 ```
 
 3) `withLoader` very popular  withLoader HOC is a pattern used to add a loading indicator or spinner to a component while it is fetching data asynchronously.
 ```
 
    import React from 'react';

    const withLoader = (WrappedComponent) => {
      return class WithLoader extends React.Component {
        state = {
          loading: true,
        };
    
        componentDidMount() {
          setTimeout(() => {
            this.setState({ loading: false });
          }, 2000);
        }
    
        render() {
          const { loading } = this.state;
          return loading ? <div>Loading...</div> : <WrappedComponent {...this.props} />;
        }
      };
    };

   export default withLoader;
 ```
 
 Usage: 
  ```
    import React from 'react';
    import withLoader from './withLoader'; 
    
    const MyComponent = (props) => {
    
     // This components will not be rendered until loading

      return (
        <div> some data </div>
      );
    };
    
   export default withLoader(MyComponent);
 ```
 
 ## 7 What's the difference in handling exceptions in promises, callbacksand async...await?
 
`Callbacks`, an old-fashioned style for managing asynchronous fetching and error handling, are done by passing an error parameter as the first argument to the callback function

Example: 

```
const fetch = (callback) => {
  setTimeout(() => {
    const success = false;
    
    if (success) {
      callback(null, 'Success');
    } else {
      callback(new Error('Error'));
    }
  }, 1000);
};

fetch((error, data) => {
  if (error) {
    console.error(error.message);
  } else {
    ...
  }
});
```

`Promises` next gen after `Callbacks` use `then`, `catch`, `finally` for handling responses and errors, when promise will be rejected, errors will fall to the nearest `catch`

Example:
```
const fetch = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = false;
      
      if (success) {
        resolve('Success');
      } else {
        reject(new Error('Error'));
      }
    }, 1000);
  });
};

fetch()
  .then((data) => {
    return data;
  })
  .then((data) => {
    return data;
  })
  .catch((error) => {
    console.error(error.message);
  });
```

Async/Await is the newest and my favorite method. For error handling, you should use try-catch blocks on async functions.

Example: 
```
    const fetch = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = false;
          if (success) {
            resolve('Success');
          } else {
            reject(new Error('Error'));
          }
        }, 1000);
      });
    };
    
    const asyncHandler = async () => {
      try {
        const data = await fetch();
        console.log(data);
      } catch (error) {
        console.error(error.message);
      }
    };
```

## 8 How many arguments does setState take and why is it async.
`setState` takes two arguments. The first argument is mandatory and can be either a state object or a function (which receives the previous state as a parameter). The second argument is optional and is a callback that will be triggered after the new state is set and the component is re-rendered.

Example:
```
    state = { foo: 0 };
    handleFrom = () => {
        this.setState({ foo: this.state.foo + 1 }, // first argument obj / fnc
        () => {
            console.log('Updated');
        }); //  will be triggered after the state update and component re-render.
    };`
```

And the main reason why setState is async for optimize and batch multiple state updates;

## 9 List the steps needed to migrate a Class to Function Component.

1) Replace Class with Function (Named or Anonymous): Instead of defining your component as a class, define it as a function using ES6 arrow functions or regular functions.

2) Change State from setState and Constructor to useState Hook Implementation: Replace state management using this.state and setState() with the useState hook to manage state in functional components.

3) Change Lifecycle Methods: Instead of using class lifecycle methods like componentDidMount, componentWillUnmount, etc., use the useEffect hook. This hook allows you to implement the whole component lifecycle flow within functional components.

4) Change Event Handlers: Convert event handlers from class methods to regular functions. In functional components, you can define event handlers directly within the component function.

5) Check Other Stuff: Replace other class-based features like refs (this.refs) with hooks like useRef.

6) Instead of render Function: In class components, you define the render method to return JSX. In functional components, you simply return JSX directly from the function.


## 10 List a few ways styles can be used with components.

1) The most fastest way to style component is `inline styles` 
 
 Example:
 ``` 
    <div styles={{ display: 'flex', width: '100%' }}>...</div>
 ```
 Prop styles require an object, so every style should be written in `camelCase`

2) Next one is css classes or some libs like tailwind matherial etc.
    
  Example: 
  ```
    import './index.css';
    
    <div className="wrapper">...</div>
  ```
In React, the class attribute is reserved by HTML, so you should use the className attribute to apply CSS classes to React components.

3) CSS Modules, in case Webpack, Rollup, ESBuild, or another bundler is used, you can locally scope CSS per component.

 Example:
 ```
    import styles from './Component.module.postcss'; 
    
    <div className={styles.wrapper}>...</div>
 ```
 
 4) One of my fav 'CSS-in-JS' libraries, 'styled-components,' allows writing CSS inside JavaScript. This can be very helpful for handling conditional styling, where some styles depend on props.
 
 Example:
 ```
    import styled from 'styled-components';

    const StyledButton = styled.StyledButton`
      color: blue;
      font-size: 16px;
    
    // Example how we can manage styles via component prop
      border: ${(props) => props.type === 'submit' : '1px solid black' :  'none'};
    `;
    
    const MyComponent = () => {
      return <StyledButton type="submit">submit</StyledButton>;
    };
 ```
 
## 11 How to render an HTML string coming from the server.
 For rendering HTML string from server React have `dangerouslySetInnerHTML`
 
 Example: 
 ```
    <div dangerouslySetInnerHTML={{ __html: htmlString }} />
 ```
 
Rendering HTML in that way is highly not recommended because it can affect security and expose your application to XSS attacks.
 
    

