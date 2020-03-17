import React from 'react';
import { TopRowWrapper, TitleWrapper, Title, HeaderWrapper, TemplateSourceWrapper, SourceWrapper, Source } from './styled';
import { ActionButton, ScrollablePane, Text } from 'office-ui-fabric-react';

interface TemplateSourceInfoProps {
  templateJSON?: object;
}

class TemplateSourceInfo extends React.Component<TemplateSourceInfoProps> {

  onCopy = () => {
    let copyCode = document.createElement('textarea');
    if (this.props.templateJSON) {
      let sourceJSON = JSON.stringify(this.props.templateJSON, undefined, 2);
      copyCode.innerText = sourceJSON;
    }
    document.body.appendChild(copyCode);
    copyCode.select();
    document.execCommand('copy');
    copyCode.remove();
  }

  render() {
    let sourceJSON = undefined;
    if (this.props.templateJSON) {
      sourceJSON = JSON.stringify(this.props.templateJSON, null, 2);
    }
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
                {sourceJSON ? sourceJSON : 'undefined'}
              </Source>
            </SourceWrapper>
          </ScrollablePane>
        </TemplateSourceWrapper>
      </React.Fragment>
    );
  }
}

export default TemplateSourceInfo;