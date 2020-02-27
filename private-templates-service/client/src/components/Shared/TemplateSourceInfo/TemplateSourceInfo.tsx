import React from 'react';
import { TopRowWrapper, TitleWrapper, Title, HeaderWrapper, TemplateSourceWrapper, SourceWrapper, Source } from './styled';
import { ActionButton, ScrollablePane, Text } from 'office-ui-fabric-react';

interface TemplateSourceInfoProps {
  templateJSON?: string;
}

const tempJSON = {
  "one": "hello",
  "two": "bye",
}

class TemplateSourceInfo extends React.Component<TemplateSourceInfoProps> {

  onCopy = () => {
    let copyCode = document.createElement('textarea');
    if (this.props.templateJSON) {
      let sourceJSONobj = JSON.parse(JSON.parse(this.props.templateJSON));
      copyCode.innerText = JSON.stringify(sourceJSONobj, undefined, 2);
    }
    document.body.appendChild(copyCode);
    copyCode.select();
    document.execCommand('copy');
    copyCode.remove();
  }

  render() {
    let sourceJSONobj = undefined;
    if (this.props.templateJSON) {
      sourceJSONobj = JSON.parse(JSON.parse(this.props.templateJSON));
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
                {sourceJSONobj ? JSON.stringify(sourceJSONobj, undefined, 2) : 'undefined'}
              </Source>
            </SourceWrapper>
          </ScrollablePane>
        </TemplateSourceWrapper>
      </React.Fragment>
    );
  }
}

export default TemplateSourceInfo;