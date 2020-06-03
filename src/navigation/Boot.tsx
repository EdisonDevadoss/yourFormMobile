import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SecuredRootStack from './SecuredRootStack';
import {Root} from 'native-base';

const Boot = () => {
  return (
    <Root>
      <NavigationContainer>
        <SecuredRootStack />
      </NavigationContainer>
    </Root>
  );
};
export default Boot;
