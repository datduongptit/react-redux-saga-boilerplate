import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { usePrevious } from 'react-use';
import styled, { ThemeProvider } from 'styled-components';
import { px } from 'styled-minimal';

import history from 'modules/history';
import { useShallowEqualSelector } from 'modules/hooks';
import theme, { headerHeight } from 'modules/theme';

import config from 'config';

import { showAlert } from 'actions';

import Footer from 'components/Footer';
import Header from 'components/Header';
import RoutePrivate from 'containers/RoutePrivate';
import RoutePublic from 'containers/RoutePublic';
import SystemAlerts from 'containers/SystemAlerts';
import Home from 'routes/Home';
import NotFound from 'routes/NotFound';
import Private from 'routes/Private';

import { StoreState, UserState } from 'types';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  opacity: 1 !important;
  position: relative;
  transition: opacity 0.5s;
`;

const Main = styled.main<Pick<UserState, 'isAuthenticated'>>`
  min-height: 100vh;
  padding: ${({ isAuthenticated }) => (isAuthenticated ? `${px(headerHeight)} 0 0` : 0)};
`;

function Root() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useShallowEqualSelector((s: StoreState) => s.user);
  const previousIsAuthenticated = usePrevious(isAuthenticated);

  useEffect(() => {
    if (previousIsAuthenticated !== isAuthenticated && isAuthenticated) {
      dispatch(showAlert('Hello! And welcome!', { variant: 'success', icon: 'bell', timeout: 10 }));
    }
  }, [dispatch, isAuthenticated, previousIsAuthenticated]);

  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <AppWrapper data-testid="app">
          <Helmet
            defaultTitle={config.name}
            defer={false}
            encodeSpecialCharacters
            htmlAttributes={{ lang: 'pt-br' }}
            titleAttributes={{ itemprop: 'name', lang: 'pt-br' }}
            titleTemplate={`%s | ${config.name}`}
          >
            <link
              href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap"
              rel="stylesheet"
            />
          </Helmet>
          {isAuthenticated && <Header />}
          <Main isAuthenticated={isAuthenticated}>
            <Switch>
              <RoutePublic
                component={Home}
                exact
                isAuthenticated={isAuthenticated}
                path="/"
                to="/private"
              />
              <RoutePrivate component={Private} isAuthenticated={isAuthenticated} path="/private" />
              <Route component={NotFound} />
            </Switch>
          </Main>
          <Footer />
          <SystemAlerts />
        </AppWrapper>
      </ThemeProvider>
    </Router>
  );
}

export default Root;
