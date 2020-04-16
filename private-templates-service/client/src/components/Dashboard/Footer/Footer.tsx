import React from 'react';
import { FooterOuterContainer, FooterContents, FooterLink, FooterContainer } from './styled';
import * as STRINGS from '../../../assets/strings';

const footerLinks = [
  {
    name: STRINGS.SITEMAP,
    link: "https://www.microsoft.com/en-us/sitemap.aspx"
  },
  {
    name: STRINGS.CONTACT,
    link: "https://support.microsoft.com/en-us/contactus/"
  },
  {
    name: STRINGS.PRIVACY,
    link: "https://go.microsoft.com/fwlink/?LinkId=521839"
  },
  {
    name: STRINGS.TERMS,
    link: "https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/default.aspx"
  },
  {
    name: STRINGS.TRADEMARKS,
    link: "https://www.microsoft.com/trademarks"
  },
  {
    name: STRINGS.SAFETY,
    link: "https://www.microsoft.com/en-us/devices/safety-and-eco"
  },
  {
    name: STRINGS.ABOUT_ADS,
    link: "https://choice.microsoft.com/"
  },
  {
    name: STRINGS.MICROSOFT,
    link: "https://www.microsoft.com/en-ca/"
  }
];

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <FooterOuterContainer>
          <FooterContainer>
            <FooterContents>
              {footerLinks.map((val, index: number) => (
                <FooterLink key={index} href={val.link}>{val.name}</FooterLink>
              ))}
            </FooterContents>
          </FooterContainer>
        </FooterOuterContainer>
      </footer>
    );
  }
}

export default Footer;
