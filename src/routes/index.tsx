import React from 'react';
import { Switch } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

import AppRoute from './Route';

const Routes: React.FC = () => (
  <Switch>
    <AppRoute path="/" exact component={SignIn} />
    <AppRoute path="/signup" component={SignUp} />
    <AppRoute path="/forgot_password" component={ForgotPassword} />
    <AppRoute path="/reset_password" component={ResetPassword} />

    <AppRoute path="/dashboard" component={Dashboard} isPrivate />
    <AppRoute path="/profile" component={Profile} isPrivate />
  </Switch>
);

export default Routes;
