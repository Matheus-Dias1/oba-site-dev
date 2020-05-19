import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React from 'react';

import { Platform, StatusBar } from "react-native";

if (Platform.OS === "android") {
  if (typeof (Intl).__disableRegExpRestore === "function") {
    (Intl).__disableRegExpRestore();
  }
}

import Routes from './src/routes';

export default function App() {
  return (
    <>
      {Platform.OS === "android" ?
        <StatusBar barStyle="light-content" />
        :
        <StatusBar barStyle="dark-content" />
      }
      <Routes />
    </>
  );
}

