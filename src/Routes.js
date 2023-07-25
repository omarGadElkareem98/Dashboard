import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './screens/Home';
import Statistics from './screens/Statistics';
import Users from './screens/Users';
import Products from './screens/Products';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/statistics" component={Statistics} />
      <Route path="/users" component={Users} />
      <Route path="/products" component={Products} />
    </Switch>
  );
};

export default Routes;