import React from 'react';
import { TopRowWrapper, TitleWrapper, Title, HeaderWrapper, TemplateSourceWrapper, SourceWrapper, Source } from './styled';
import { ActionButton, ScrollablePane } from 'office-ui-fabric-react';
import { TEMPLATE_JSON, COPY_JSON, UNDEFINED } from '../../../assets/strings';

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
              <Title>{TEMPLATE_JSON}</Title>
            </TitleWrapper>
            <ActionButton iconProps={{ iconName: 'Copy' }} onClick={this.onCopy}>
              {COPY_JSON}
            </ActionButton>
          </TopRowWrapper>
        </HeaderWrapper>
        <TemplateSourceWrapper>
          <ScrollablePane initialScrollPosition={0} scrollbarVisibility="always">
            <SourceWrapper>
              <Source>
                {sourceJSON ? sourceJSON : `${UNDEFINED}`}
              </Source>
            </SourceWrapper>
          </ScrollablePane>
        </TemplateSourceWrapper>
      </React.Fragment>
    );
  }
}

export default TemplateSourceInfo;
