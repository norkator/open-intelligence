Terminology
======
* <b>HOC</b> stands for "Higher order component"


Aux
======
This can be used to wrap other elements
```html
<Aux>
  <div>Hello world<div/>
</Aux>
```


AsyncComponent
======
Example of how to use:

```typescript jsx
const loadedComponent = asyncComponent(() => {
  return import('./folder/Component/Component');
});
```
```typescript jsx
<Route path="/somepath" component={loadedComponent} />
```
