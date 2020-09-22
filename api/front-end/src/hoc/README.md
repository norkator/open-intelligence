Terminology
======
* <b>HOC</b> stands for "Higher order component"


Auxiliary
======
This can be used to wrap other elements
```html
<Auxiliary>
  <div>Hello world<div/>
</Auxiliary>
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
