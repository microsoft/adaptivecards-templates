import React from 'react';
import { TopRowWrapper, TitleWrapper, Title, HeaderWrapper, TemplateSourceWrapper, SourceWrapper, Source } from './styled';
import { ActionButton, ScrollablePane, Text } from 'office-ui-fabric-react';

class TemplateSourceInfo extends React.Component {

  onCopy = () => {
    alert("Copied!");
  }

  render() {
    return (
      <React.Fragment>
        <HeaderWrapper>
          <TopRowWrapper>
            <TitleWrapper>
              <Title>Template JSON</Title>
            </TitleWrapper>
            <ActionButton iconProps={{ iconName: 'Copy' }} onClick={this.onCopy}>
              Copy JSON
            </ActionButton>
          </TopRowWrapper>
        </HeaderWrapper>
        <TemplateSourceWrapper>
          <ScrollablePane initialScrollPosition={0} scrollbarVisibility="always">
            <SourceWrapper>
              <Source>
                This is text. This is text. This is text.
              </Source>
            </SourceWrapper>
          </ScrollablePane>
        </TemplateSourceWrapper>
      </React.Fragment>
    );
  }
}

export default TemplateSourceInfo;