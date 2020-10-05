import React from 'react';
import { Switch } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';

import AppRoute from './Route';

const Routes: React.FC = () => (
  <Switch>
    <AppRoute path="/" exact component={SignIn} />
    <AppRoute path="/signup" component={SignUp} />
    <AppRoute path="/forgot-password" component={ForgotPassword} />

    <AppRoute path="/dashboard" component={Dashboard} isPrivate />
  </Switch>
);

export default Routes;
