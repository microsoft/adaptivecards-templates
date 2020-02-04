import {createTheme} from 'office-ui-fabric-react';
export const COLORS = {
  PRIMARY: '#6F6F6F',
  SECONDARY: '#707070',
  WHITE: '#FFFFFF',
  GREY1: '#FAFAFA',
  GREY2: '#EAEAEA',
  GREY3: '#6F6F6F',
  GREY4: '#5C5C5C',
  GREEN: '#00D610',
  YELLOW: '#FFBD53',
  BLUE: '#016FC4',
}

export const BREAK = {
  SM: 768,
  MD: 992,
  LG: 1200,
}

export const THEME = {
  DARK : createTheme({
    palette: {
      themePrimary: '#ffffff',
      themeLighterAlt: '#767676',
      themeLighter: '#a6a6a6',
      themeLight: '#c8c8c8',
      themeTertiary: '#d0d0d0',
      themeSecondary: '#dadada',
      themeDarkAlt: '#eaeaea',
      themeDark: '#f4f4f4',
      themeDarker: '#f8f8f8',
      neutralLighterAlt: '#595959',
      neutralLighter: '#585858',
      neutralLight: '#545454',
      neutralQuaternaryAlt: '#4e4e4e',
      neutralQuaternary: '#4b4b4b',
      neutralTertiaryAlt: '#484848',
      neutralTertiary: '#c8c8c8',
      neutralSecondary: '#d0d0d0',
      neutralPrimaryAlt: '#dadada',
      neutralPrimary: '#ffffff',
      neutralDark: '#f4f4f4',
      black: '#f8f8f8',
      white: '#5c5c5c',
    }
  })
}