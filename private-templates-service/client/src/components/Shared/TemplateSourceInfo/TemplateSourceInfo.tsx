import React from 'react';
import { TopRowWrapper, TitleWrapper, Title, HeaderWrapper, TemplateSourceWrapper, SourceWrapper, Source } from './styled';
import { ActionButton, ScrollablePane, Text } from 'office-ui-fabric-react';

interface TemplateSourceInfoProps {
  templateJSON?: string;
}

class TemplateSourceInfo extends React.Component<TemplateSourceInfoProps> {

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
                {this.props.templateJSON !== undefined ? this.props.templateJSON : 'undefined'}
              </Source>
            </SourceWrapper>
          </ScrollablePane>
        </TemplateSourceWrapper>
      </React.Fragment>
    );
  }
}

export default TemplateSourceInfo;